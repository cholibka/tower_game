function GameOver(props) {
    return (
        <div className="gameOver">
            <p>Game Over!</p>
            <p>Final score: {props.score}</p>
            <div style={{ display: "inline" }}>
                <p className="name">Enter your name: </p>
                <input ref={props.inputRef}></input>
            </div>
            <div style={{ display: "inline" }}>
                <button onClick={props.refresh}>Try again?</button>
                <button onClick={props.showLeaderboard}>Leaderboard</button>
            </div>
        </div>
    );
}

export default GameOver;
