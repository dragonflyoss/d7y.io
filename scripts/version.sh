#!/bin/bash

version=$1

if [ ${#version} == 0 ]
then
  echo "version shouldn't be empty"
  exit 1
fi

rm -rf ./versioned_sidebars/version-"${version}"-sidebars.json
echo "remove ./versioned_sidebars/version-${version}-sidebars.json"

rm -rf ./versioned_docs/version-"${version}"
echo "remove ./versioned_docs/version-${version}"

sed -i.bak "/${version}/d" versions.json
rm -rf versions.json.bak
echo "update versions.json"

sed -i.bak "/${version}/d" docusaurus.config.js
echo "update docusaurus.config.js"

yarn run docusaurus docs:version "${version}"
rm -rf docusaurus.config.js
mv docusaurus.config.js.bak docusaurus.config.js
echo "generate ${version} docs"

