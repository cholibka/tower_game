import { Fragment, useEffect, useState } from "react";

function Leaderboard(props) {
    const refresh = () => {
        window.location.reload();
    };
    return (
        <div className="leaderboard">
            <div className="grid-container">
                <p className="bold">RANK</p>
                <p className="bold">NAME</p>
                <p className="bold">SCORE</p>
                {props.scores
                    .sort((a, b) => b.score - a.score)
                    .map((score, index) => {
                        return (
                            <Fragment key={score.id}>
                                <p>{index + 1}</p>
                                <p>{score.username}</p>
                                <p>{score.score}</p>
                            </Fragment>
                        );
                    })}
                {props.scores.length < 10
                    ? [...Array(10 - props.scores.length)].map((x, i) => (
                          <Fragment key={i}>
                              <p>..</p>
                              <p>..</p>
                              <p>..</p>
                          </Fragment>
                      ))
                    : null}
            </div>
            <button className="leaderboard_btn" onClick={refresh}>
                Try again?
            </button>
        </div>
    );
}

export default Leaderboard;
