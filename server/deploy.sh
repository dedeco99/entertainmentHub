npm run client-build
ssh debian@ehub.rabbitsoftware.dev 'rm -rf /home/debian/entertainmenthub/server/build'
scp -r build debian@ehub.rabbitsoftware.dev:/home/debian/entertainmenthub/server