const blessed = require("blessed");
const contrib = require("blessed-contrib");
const getData = require("./getData");
const {
  getCoordinates,
  toHumanDate,
  toMinutes,
  filterOutliers
} = require("./utils");

const screen = blessed.screen();
screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

const stepName = "buildinfra:aat"; // possible values: "dockerbuild", "buildinfra:aat", etc.

const formatData = async jobName => {
  const rawData = await getData(jobName, stepName);
  const liarsOnBuildCurDuration = filterOutliers("current_build_duration");
  const filteredData = rawData.filter(liarsOnBuildCurDuration(rawData));
  return {
    data: {
      x: filteredData.map(toHumanDate("_ts")),
      y: filteredData.map(toMinutes("current_build_duration"))
    },
    jobName
  };
};

const colWidth = 6;
const colHeight = 6;
const getCoord = getCoordinates(colWidth, colHeight);

const setLine = ({ jobName, data }, index) => {
  const [x, y] = getCoord(index);

  const line = grid.set(x, y, colHeight, colWidth, contrib.line, {
    style: { line: "yellow", text: "white", baseline: "white" },
    xLabelPadding: 3,
    xPadding: 5,
    label: ` Build duration till ${stepName} in min. (${
      jobName.match(/\/(.*)\//)[1]
    }) `
  });
  screen.append(line); // must append before setting data
  line.setData([data]);
};

const main = async () => {
  const dataSet = await Promise.all(
    [
      "HMCTS_CDM/ccd-case-print-service/master",
      "HMCTS_CMC/cmc-legal-rep-frontend/master",
      "HMCTS_CDM/ccd-admin-web/master",
      "HMCTS_CDM/ccd-case-management-web/master"
    ].map(formatData)
  );

  dataSet.forEach(setLine);

  screen.render();
};

main().catch(e => console.log(e));
