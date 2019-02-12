const blessed = require("blessed");
const contrib = require("blessed-contrib");
const getData = require("./getData");
const { getCoordinates, toHumanDate, toMinutes } = require("./utils");

const screen = blessed.screen();
screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

const formatData = async jobName => {
  const rawData = await getData(jobName);
  return {
    data: {
      x: rawData.map(toHumanDate("_ts")),
      y: rawData.map(toMinutes("current_build_duration"))
    },
    jobName
  };
};

const colWidth = 4;
const getCoord = getCoordinates(colWidth);

const setLine = ({ jobName, data }, index) => {
  const [x, y] = getCoord(index);

  const line = grid.set(x, y, colWidth, colWidth, contrib.line, {
    style: { line: "yellow", text: "white", baseline: "white" },
    xLabelPadding: 3,
    xPadding: 5,
    label: ` Duration in minutes (${jobName}) `
  });
  screen.append(line); // must append before setting data
  line.setData([data]);
};

const main = async () => {
  const dataSet = await Promise.all(
    [
      "HMCTS_CDM/ccd-case-print-service/master",
      "HMCTS_CMC/cmc-legal-rep-frontend/master",
      "HMCTS_SSCS/sscs-track-your-appeal-notifications/master",
      "HMCTS_CDM/ccd-admin-web/master",
      "HMCTS_CDM/ccd-case-management-web/master",
      "HMCTS_SSCS/sscs-track-your-appeal-notifications/master"
    ].map(formatData)
  );

  dataSet.forEach(setLine);

  screen.render();
};

main().catch(e => console.log(e));
