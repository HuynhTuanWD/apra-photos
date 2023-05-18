module.exports = {
  "**/*.(ts|tsx|js|jsx|md|json|scss|css)": filenames => [
    `yarn prettier --write ${filenames.join(" ")}`,
  ],
};
