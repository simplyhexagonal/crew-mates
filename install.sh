npm --version || (echo "ERROR: NPM required for installation" && exit 1)
tar --version || (echo "ERROR: Tar required for installation" && exit 1)

cd /tmp \
&& npm --registry=https://npm.pkg.github.com pack @GreenCubeIO/crew-mates@latest \
&& sudo tar --strip-components=1 -xzf GreenCubeIO-crew-mates-*.tgz --directory "/"

if [ "$?" != "0" ]; then
  exit 1
fi

rm -f GreenCubeIO-crew-mates-*.tgz

echo "🎉 Crew Mates have installed successfully!"
