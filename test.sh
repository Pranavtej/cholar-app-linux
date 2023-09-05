#!/bin/bash

linux_dep=(zenity curl parallel python3-pip git libcurl4-openssl-dev libmagick++-dev libmariadbclient-dev libssl-dev)

if [[ -n "$(uname | grep Darwin)" ]]; then
  for i in "${linux_dep[@]}"; do
    brew install "$i"
  done
elif [[ -n "$(expr substr $(uname -s) 1 5 | grep Linux)" ]]; then
  if [[ -n "$(awk -F= '/^NAME/{print $2}' /etc/os-release | tr -d '"' | grep Ubuntu)" ]]; then
     apt-get update -y
     apt-get upgrade -y
    for i in "${linux_dep[@]}"; do
       apt-get install -y "$i"
    done
  elif [[ -n "$(awk -F= '/^NAME/{print $2}' /etc/os-release | tr -d '"' | grep CentOS)" ]]; then
     yum update -y
     yum upgrade -y
    for i in "${linux_dep[@]}"; do
       yum install -y "$i"
    done
  fi
fi

script_dir=$PWD

# Install curl if not already installed
if [[ -z "$(which curl | grep curl)" ]]; then
   mkdir -p $HOME/C_files/application
  cd $HOME/C_files/application
  wget -c https://github.com/curl/curl/releases/download/curl-7_55_0/curl-7.55.0.tar.gz
  tar -xvzf curl-7.55.0.tar.gz
  rm curl-7.55.0.tar.gz
  cd curl-7.55.0/
   ./configure
   make
   make install
  cd ..
fi

# Install Miniconda/Anaconda
if [[ (-z "$(which conda | grep conda)") && (-n "$(uname | grep Darwin)") ]]; then
  curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
   bash Miniconda3-latest-MacOSX-x86_64.sh -b
  eval "$($HOME/miniconda3/bin/conda shell.zsh hook)"
  source $HOME/miniconda3/bin/activate
   mkdir -p $HOME/miniconda3/c_pkgs
   conda config --add pkgs_dirs c_pkgs
  rm Miniconda3-latest-MacOSX-x86_64.sh -b
elif [[ (-z "$(which conda | grep conda)") && (-n "$(expr substr $(uname -s) 1 5 | grep Linux)") ]]; then
  curl -O https://repo.anaconda.com/miniconda/Miniconda3-py39_4.11.0-Linux-x86_64.sh
   bash Miniconda3-py39_4.11.0-Linux-x86_64.sh -b
  eval "$($HOME/miniconda3/bin/conda shell.bash hook)"
  source ~/.bashrc
  rm Miniconda3-py39_4.11.0-Linux-x86_64.sh
elif [[ (-n "$(which conda | grep conda)") && (-n "$(uname | grep Darwin)") ]]; then
   mkdir -p $HOME/miniconda3/c_pkgs
   conda config --add pkgs_dirs c_pkgs
elif [[ (-n "$(which conda | grep conda)") && (-n "$(expr substr $(uname -s) 1 5 | grep Linux)") && (-n "$(conda env list | grep ngs)") ]]; then
  if [[ -d ~/miniconda3 ]]; then
    source ~/miniconda3/etc/profile.d/conda.sh
    conda activate ngs
  elif [[ -d ~/anaconda3 ]]; then
    source ~/anaconda3/etc/profile.d/conda.sh
    conda activate ngs
  fi
elif [[ (-n "$(which conda | grep conda)") && (-z "$(conda env list | grep ngs)") && (-n "$(expr substr $(uname -s) 1 5 | grep Linux)") ]]; then
  conda create -q -y -n ngs python=3
  conda init bash
  source ~/.bashrc
  if [[ -d ~/miniconda3 ]]; then
    source ~/miniconda3/etc/profile.d/conda.sh
    conda activate ngs
  elif [[ -d ~/anaconda3 ]]; then
    source ~/anaconda3/etc/profile.d/conda.sh
    conda activate ngs
  fi
fi

conda_dep=(fastqc multiqc hisat2 samtools stringtie gffcompare gffread)

for i in "${conda_dep[@]}"; do
  if [[ -z "$(which $i | grep $i)" ]]; then
    conda install -q -y -c bioconda $i
  fi
done

if [[ -z "$(which htseq-count | grep htseq-count)" ]]; then
  conda install -q -y -c bioconda htseq
fi

if [[ -z "$(which R | grep R)" ]]; then
  conda config --add channels conda-forge
  conda config --set channel_priority strict
  conda install -q -y -c conda-forge r-base
elif [[ (-n "$(which R | grep R)") && (-z "$(which R | grep envs)") ]]; then
  conda config --add channels conda-forge
  conda config --set channel_priority strict
  conda install -q -y -c conda-forge r-base
elif [[ (-n "$(which R | grep envs)") && ( $(R --version | grep "R version" | cut -d " " -f3 | cut -d "." -f1) -le 3 ) ]]; then
  conda config --add channels conda-forge
  conda config --set channel_priority strict
  conda update -y -q -c conda-forge r-base
fi

# Download and place Trimmomatic
d1=$HOME/C_files/application
f1=$HOME/C_files/application/Trimmomatic-0.39.zip
if [[ ! -d "$d1" ]]; then
  mkdir -p $HOME/C_files/application
  if [[ ! -f "$f1" ]]; then
    curl -O http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip
    mv Trimmomatic-0.39.zip $d1
    cd $d1
    unzip Trimmomatic-0.39.zip
  fi
elif [[ (-d "$d1") && (! -f "$f1") ]]; then
  curl -O http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip
  mv Trimmomatic-0.39.zip $d1
  cd $d1
  unzip Trimmomatic-0.39.zip
elif [[ (! -d $HOME/C_files/application/Trimmomatic-0.39) && ( -f "$f1") ]]; then
  unzip $f1
fi

# Install CPAT
if [[ -z "$(which cpat.py | grep cpat.py)" ]]; then
  pip3 install CPAT
fi

# Downloading Reference annotation file from Gencode
d2=$HOME/C_files/genome/human/hg38/annotation
f2=$HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf
if [[ (! -d "$d2") ]]; then
  mkdir -p $HOME/C_files/genome/human/hg38/annotation
  curl -OL "https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_40/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz"
   mv *.annotation.gtf.gz $HOME/C_files/genome/human/hg38/annotation
  cd $HOME/C_files/genome/human/hg38/annotation
   gzip -d gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz
fi

# Create splice site file
f3=$HOME/C_files/genome/human/hg38/annotation/gencode.v40.splicesite.annotation.ss
if [[ ! -f "$f3" ]]; then
  hisat2_extract_splice_sites.py $HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf > gencode.v40.splicesite.annotation.ss
fi

# Downloading reference genome
d3=$HOME/C_files/genome/human/hg38/ref_gen
f4=$HOME/C_files/genome/human/hg38/ref_gen/hg38.fa
if [[ (! -d "$d3") ]]; then
  mkdir -p $HOME/C_files/genome/human/hg38/ref_gen
  cd $script_dir
  curl -OL "http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz"
  mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen
  cd $HOME/C_files/genome/human/hg38/ref_gen
  gzip -d hg38.fa.gz
elif [[ (-d "$d3") && (-f "$f4.gz") && (! -f "$f4") ]]; then
  rm *.gz
  cd $script_dir
  curl -OL "http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz"
  mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen
  cd $HOME/C_files/genome/human/hg38/ref_gen
  gzip -d hg38.fa.gz
elif [[ (-d "$d3") && (! -f "$f4") ]]; then
  cd $script_dir
  curl -OL "http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz"
  mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen
  cd $HOME/C_files/genome/human/hg38/ref_gen
  gzip -d hg38.fa.gz
fi

# Index building
f5=$HOME/C_files/genome/human/hg38/ref_gen/hg38.1.ht2
if [[ ! -f "$f5" ]]; then
  hisat2-build hg38.fa hg38.fa
fi

# Installing R packages
Rscript $script_dir/source/conf.R
