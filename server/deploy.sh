npm run client-build
ssh ubuntu@ehub.rabbitsoftware.dev 'rm -rf /home/ubuntu/entertainmenthub/server/build'
scp -r build ubuntu@ehub.rabbitsoftware.dev:/home/ubuntu/entertainmenthub/server