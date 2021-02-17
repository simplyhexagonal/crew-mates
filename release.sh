BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo '
  ERROR: You must be on main branch in order to generate a release!
  ';
  exit 1;
fi

VERSION=$(date +"1%Y-%m-%d")

mkdir -p ./dist/bin

cp ./src/* ./dist/bin/

cd dist

echo "{\"name\":\"@GreenCubeIO/crew-mates\",\"version\":\"$VERSION\",\"description\":\"Robust set of scripts to automagically manage, deploy, and keep alive mission-critical applications\",\"main\":\"chiefmate\",\"repository\":\"https://github.com/GreenCubeIO/crew-mates\",\"author\":\"Jean M. Lescure\",\"license\":\"Apache-2.0\"}" > package.json

tar -czf crew-mates-$VERSION.tgz bin

npm publish --registry=https://registry.npmjs.org

cd ..

echo $VERSION > latest.version

git add latest.version

git commit -m "chore(release): $VERSION"

git tag -a $VERSION

git push --follow-tags origin main
