#!/bin/bash
# Script Name: master_script.sh
# Author: Haneesh J
# Date: September 23, 2021
#
# Description: The following script is the bash pipeline to analyse the RNA-seq data.
#
#
# Input type: Fastq files
# Output: Different statistics files and tiff/png image of the differential gene expression analysis
#
# seting variables

# idx = location of reference genome index of the aligner to be used
# in this case it is hisat2 and it was created using hisat2-build function
idx=$1

# threads variable denote the number of cores that are going to be used in the program
threads=$2

# annotation = location of annotation file
annotation=$3

# splicefile = location of gtf annotation file, created using hisat2
# command to create splicesite file is:  python hisat2_extract_splice_sites.py
splicefile=$4

# input files directory

in_dir=$5

# script directory

scr_dir=$6

if [[ -d ~/miniconda3 ]]
then
       
        source ~/miniconda3/etc/profile.d/conda.sh
        conda activate ngs
        echo "
              #########################################
                    NGS is created and activated
              #########################################  
        "
elif [[ -d ~/anaconda3 ]]
then
       
        source ~/anaconda3/etc/profile.d/conda.sh
        conda activate ngs
        echo "
              #########################################
                    NGS is created and activated
              #########################################  
        "
fi



# date command to log the timestamp
date

cd $in_dir
#creating directory for storing fastqc_report of raw fastq files
d1=$in_dir/raw_fastqc_report
if [[ ! -d "$d1" ]]
then
        mkdir raw_fastqc_report
fi

# run fastqc on all fastq or fastq.gz files
find $in_dir -type f \( -name "*.fastq.gz" -o -name "*.fastq" \) \
        | parallel -j $threads -v -I% --max-args 1 fastqc -o raw_fastqc_report/

#running multiqc to combine all fastqc reports
multiqc $in_dir/raw_fastqc_report

# prossesing the data using trimmomatic v 0.39
date
for infile in *1.fastq
        do
	echo $infile
        name=$(echo $infile | awk -F"_." '{print $1}')
        R1_paired=${name}_1paired.fastq
        R1_unpaired=${name}_1unpaired.fastq
        R2_paired=${name}_2paired.fastq
        R2_unpaired=${name}_2unpaired.fastq
        java -jar $HOME/C_files/application/Trimmomatic-0.39/trimmomatic-0.39.jar \
        PE -threads $threads -phred33 -summary ${name}_statsSummaryFile.txt \
        $infile ${name}_2.fastq $R1_paired $R1_unpaired $R2_paired $R2_unpaired \
        ILLUMINACLIP:$HOME/C_files/application/Trimmomatic-0.39/adapters/TruSeq3-PE.fa:2:40:15 \
        LEADING:28 TRAILING:28 AVGQUAL:28 MINLEN:50 
done

#sorting the output files in different directories
rm *unpaired.fastq* 

d2=$in_dir/Paired
if [[ ! -d "$d2" ]]
then
        mkdir Paired 
        mv *paired.fastq* Paired/        
fi

d3=$in_dir/raw_fastq
if [[ ! -d "$d3" ]]
then
        mkdir raw_fastq
        mv *.fastq* raw_fastq/
fi

d4=$in_dir/trim_summary
if [[ ! -d "$d4" ]]
then
        mkdir trim_summary
        mv *SummaryFile.txt trim_summary
fi



#running fastqc on processed files
cd $in_dir/Paired/
mkdir processed_fastqc_report
find $in_dir/Paired -type f \( -name "*.fastq.gz" -o -name "*.fastq" \) \
        | parallel -j $threads -v -I% --max-args 1 fastqc -o processed_fastqc_report/

multiqc $in_dir/Paired/processed_fastqc_report

#moving processed files into main directory
mv $in_dir/Paired/processed_fastqc_report/ $in_dir

#running alignment using HISAT 2

#loop for hisat2

for i in *1paired.fastq
do
  	name=$(echo $i | awk -F"_" '{print $1}')
        R1_pair=${name}_1paired.fastq
        R2_pair=${name}_2paired.fastq
        # display the command used
        # options for hisat: -p is for threads used, --known-splicesite-infile is for splice site file
        # options for samtools: view is for file conversion, -bS is for .bam as output and .sam as input
        # options for samtools: sort is for sorting, -n is sorting by name, -o is for output
        # options for samtools: fixmate is for fix mate information, markdup is for marking duplicates
        hisat2 -p $threads -x $idx --known-splicesite-infile $splicefile -1 $R1_pair -2 $R2_pair \
                | samtools view -@ $threads -bS - \
                | samtools sort -@ $threads -n - -o $name.sorted.bam
done

# removing PCR duplicates and index the bam files
for j in *.sorted.bam
do
  	name1=$(echo $j | awk -F".sorted." '{print $1}')
        #options for samtools: fixmate is for fix mate information, markdup is for marking duplicates
        samtools fixmate -@ $threads -m $j - \
                | samtools sort -@ $threads - \
                | samtools markdup -@ $threads -rs - $name1.rmPCRdup.bam
        samtools index -@ 40 -b $name1.rmPCRdup.bam
done

rm *.sorted.bam
rm *.fastq


for i in *rmPCRdup.bam
do
  	name=$(echo $i | awk -F".rmPCRdup" '{print $1}')
        # options for stringtie: -G is for annotation file, -o is for output 
        ## gtf file, -p is or threads, -b is for location of ballown table files
        # options for stringtie: -A is for output of gene abundance file
        stringtie $i -G ${annotation} -o $name.gencode.gtf -p $threads 
done


#out_file = name of merged tf file
out_file=data_merge_annotation.gtf
ls *gencode.gtf > temp.gtf.list

stringtie --merge -p $threads -G $annotation -m 200 -F 1 -c 200 \
-o $out_file temp.gtf.list 

rm temp.gtf.list
#STEP 8 comparing the information in merged gtf from stringtie and annotation file
#merge_gtf = location of merged gtf file created in STEP 7

# comparing the transcript assembly with refrence annotation

gffcompare -r ${annotation} -M -o common-merged $out_file

# extract the no of putative novel transcript and save it in a report file
nov_trans=$(cat common-merged.annotated.gtf \
        | awk '$3=="transcript" && $2=="StringTie"' \
        | grep -v 'class_code "="' wc -l)

echo No of novel transcripts in the sample is $nov_trans > novel_trans_report.txt

# extract the genomic coordinates of putative novel transcripts
cat common-merged.annotated.gtf \
        |  awk '$3=="transcript" && $2=="StringTie"' \
        | grep -v 'class_code "="' >common_novel_transcript.gtf

# extract the genomic sequences of the novel transcripts.

gffread -w common_novel_transcript_seq.fa -g $idx common_novel_transcript.gtf

# run CPAT

cpat.py -x $scr_dir/files/Human_Hexamer_hg38.tsv --antisense \
-d $scr_dir/files/Human.logit.RData --top-orf=5 -g common_novel_transcript_seq.fa \
-o coding_potential_output

# run htseq count
mkdir htseq_files

for i in *rmPCRdup.bam
do
  	name=$(echo $i | awk -F".rmPCRdup" '{print $1}')
        htseq-count -f bam $i -a 30 -s no -i transcript_id common-merged.annotated.gtf \
        > ${name}.count.txt
done

mv *.count.txt htseq_files/

cd htseq_files/

$scr_dir/source/plot.R