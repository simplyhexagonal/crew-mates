BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo '
  ERROR: You must be on main branch in order to generate a release!
  ';
  exit 1;
fi

VERSION=$(cat latest.version)

mkdir -p ./dist/usr/bin

cp ./src/* ./dist/usr/bin/

cd dist

echo "{\"name\":\"@GreenCubeIO/crew-mates\",\"version\":\"$VERSION\",\"description\":\"Robust set of scripts to automagically manage, deploy, and keep alive mission-critical applications\",\"main\":\"chiefmate\",\"repository\":\"https://github.com/GreenCubeIO/crew-mates\",\"author\":\"Jean M. Lescure\",\"license\":\"Apache-2.0\"}" > package.json

standard-version

npm --registry=https://npm.pkg.github.com publish

VERSION=$(jq .version ./package.json)

cd ..

echo $VERSION > latest.version

git add latest.version

git commit -m "chore(release): $VERSION"

git tag -af latest -m "chore(release): $VERSION"

git push --follow-tags origin main
git push --force --follow-tags origin latest
