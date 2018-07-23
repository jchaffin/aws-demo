AWS_ACCESS_KEY_ID=$(aws --profile default configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws --profile default configure get aws_secret_access_key)


alias s3-demo="docker run -ti --rm \
              -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
              -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
              -v `pwd`:/usr/share \
              -w /usr/share \
              --name=s3-demo \
              jchaffin/s3-demo:latest"

setopt complete_aliases
  
