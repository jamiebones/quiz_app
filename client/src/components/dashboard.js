import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GetDashBoardMetrics } from "../graphql/queries";
import styled from "styled-components";
import Loading from "../common/loading";

const DashBoardStyles = styled.div`
  .dash-panel {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 20px;
    padding: 20px;
  }

  .dash-title {
    font-size: 20px;
    text-transform: uppercase;
    color: #fff;
  }

  .dash-value {
    position: absolute;
    bottom: 4px;
    right: 10px;

    font-size: 40px;
  }

  .one0 {
    background-color: #9a7219;
  }

  .one1 {
    background-color: blue;
  }

  .one2 {
    background-color: green;
  }
  .row {
    justify-content: center;
  }
  .but-row {
    margin-top: 60px;
  }
`;

const DashBoard = () => {
  const [metrics, setMetrics] = useState([]);
  const { loading, error, data } = useQuery(GetDashBoardMetrics);
  const [errors, setError] = useState(null);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
    if (data) {
      const metricsData = data && data.dashboardMetrics;
      setMetrics(metricsData);
    }
  }, [loading, data, error]);

  return (
    <DashBoardStyles>
      <div className="row">
        <div className="text-center">
          {errors && (
            <p className="text-danger">
              <b>{errors}</b>
            </p>
          )}
          {loading && <Loading />}
        </div>
       
          {metrics &&
            metrics.length > 0 &&
            metrics.map(({ type, value }, index) => {
              return (
                <div
                  className={`dash-panel one${index} col-md-3 offset-md-1`}
                  key={index}
                >
                  <p className="dash-title">{type}</p>

                  <p className="dash-value">{value}</p>
                </div>
              );
            })}
        
      </div>
      <div className="row but-row card">
        <div
          className="btn-group"
          role="group"
          aria-label="Basic mixed styles example"
        >
          <button type="button" className="btn btn-danger">
            Edit Examination Schedule
          </button>
          <button type="button" className="btn btn-warning">
            Set Quiz
          </button>
          <button type="button" className="btn btn-success">
            Right
          </button>
        </div>
      </div>
    </DashBoardStyles>
  );
};

export default DashBoard;
