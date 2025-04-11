#!/bin/bash

# Define where logs go and which rule file to use
LOGDIR="./snort_logs"
RULEFILE="./test.rule"

# Make sure the log folder exists
mkdir -p $LOGDIR

# Run Snort in quiet mode (-q), using the rule file, on interface eth0
sudo snort -A console -q -c $RULEFILE -i eth0 -l $LOGDIR
