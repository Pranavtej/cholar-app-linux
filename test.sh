// Install dependencies
 apt-get update -y
 apt-get upgrade -y 
 apt-get install -y zenity curl parallel python3-pip git libcurl4-openssl-dev libmagick++-dev libmariadbclient-dev libssl-dev

// Install miniconda
curl -O https://repo.anaconda.com/miniconda/Miniconda3-py39_4.11.0-Linux-x86_64.sh  
bash Miniconda3-py39_4.11.0-Linux-x86_64.sh -b
source ~/.bashrc

// Create conda environment 
conda create -n ngs python=3
conda activate ngs

// Install bioconda packages
conda install -c bioconda fastqc multiqc hisat2 samtools stringtie gffcompare gffread

// Install htseq
conda install -c bioconda htseq 

// Install R
conda install -c conda-forge r-base

// Install trimmomatic
curl -O http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip
unzip Trimmomatic-0.39.zip

// Install cpat
pip install CPAT

// Download annotation file
curl -O https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_40/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz
gzip -d gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz

// Extract splice sites
hisat2_extract_splice_sites.py gencode.v40.chr_patch_hapl_scaff.annotation.gtf > gencode.v40.splicesite.annotation.ss

// Download reference genome 
curl -O http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz
gzip -d hg38.fa.gz

// Index genome
hisat2-build hg38.fa hg38.fa 

// Install R packages
Rscript conf.R