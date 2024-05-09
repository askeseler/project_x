import alt_data from "./scenarios.json";
import React, { useEffect, useState } from 'react';
import { Checkbox, Table, Icon } from "semantic-ui-react";

import "./AppDataLatestContents.css";

function renderHeader(arr) {
  let cell_style = { width: "10%", overflow: "hidden" };
  let cell_content_style = {
    width: "100px",
    overflow: "hidden",
    whiteSpace: "noWrap",
  };
  let cell_idx_style = { width: "20px", overflow: "hidden" };

  return (
    <Table.Row textAlign="center">
      <Table.HeaderCell style={cell_idx_style}>
        <div style={cell_idx_style}>{arr[0]}</div>
      </Table.HeaderCell>
      {arr.slice(1).map((x) => (
        <Table.HeaderCell style={{ cell_style }}>
          <div style={cell_content_style}>{x}</div>
        </Table.HeaderCell>
      ))}
    </Table.Row>
  );
}

function renderRow(dict) {
  return dict.map((attrs, idx) => {
    let cell_style = { width: "10%!", overflow: "hidden" };
    let cell_content_style = {
      width: "100px",
      overflow: "hidden",
      whiteSpace: "noWrap",
    };
    let cell_idx_style = { width: "20px", overflow: "hidden" };

    return (
      <Table.Row>
        <Table.Cell textAlign="center" style={cell_idx_style}>
          <div style={cell_idx_style}>{idx}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["title"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["video_id"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["accountname"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["channel_name"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["date"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={{width:"30px"}}>
          <div style={cell_content_style}>{attrs["n_likes"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={{width:"30px"}}>
          <div style={cell_content_style}>{attrs["n_comments"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={{width:"30px"}}>
          <div style={cell_content_style}>{attrs["time_watched"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["subtitles"]}</div>
        </Table.Cell>
        <Table.Cell textAlign="center" style={cell_style}>
          <div style={cell_content_style}>{attrs["comments"]}</div>
        </Table.Cell>
      </Table.Row>
    );
  });
}

function AppDataLatestContents(props) {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(window.api+'/items'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setData(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {fetchData()}, []);

  return (
    <div className="content" style={{padding: "50px"}}>
      <Table striped unstackable size="small" compact="very" color="orange">
        <Table.Header>
          {renderHeader(["", "Tile", "Video-ID", "Account", "Channel", "Date", "Likes", "Comments", "Time Watched", "Subtitles", "Comments"])}
        </Table.Header>
        <Table.Body>{renderRow(data)}</Table.Body>
        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan="5"></Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}

export default AppDataLatestContents;