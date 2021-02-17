npm --version || (echo "ERROR: NPM required for installation" && exit 1)
tar --version || (echo "ERROR: Tar required for installation" && exit 1)

cd /tmp \
&& npm --registry=https://npm.pkg.github.com pack @GreenCubeIO/crew-mates \
&& sudo tar -xzf crew-mates-*.tgz --directory "/"

if [ "$?" != "0" ]; then
  exit 1
fi

rm -f crew-mates-*.tgz

"🎉 Crew Mates have installed successfully!"
