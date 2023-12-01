#!/bin/bash

input_file=/opt/nginx.conf
output_file=/etc/nginx/nginx.conf

substitutions=''
substitutions="$substitutions \$LOGIN_SERVER"

# Replace the specified environment variables in the configuration file with
# values from the environment.
envsubst "${substitutions}" < ${input_file} > ${output_file}
