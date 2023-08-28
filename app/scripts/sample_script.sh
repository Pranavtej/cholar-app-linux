#!/bin/bash

# Check if 6 arguments were provided
if [ $# -ne 6 ]; then
    echo "Usage: $0 arg1 arg2 arg3 arg4 arg5 arg6"
    exit 1
fi

# Assign arguments to variables
arg1=$1
arg2=$2
arg3=$3
arg4=$4
arg5=$5
arg6=$6

# Print the arguments
echo "Argument 1: $arg1"
echo "Argument 2: $arg2"
echo "Argument 3: $arg3"
echo "Argument 4: $arg4"
echo "Argument 5: $arg5"
echo "Argument 6: $arg6"
