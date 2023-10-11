function GameOver(props) {
    const refresh = () => {
        window.location.reload(true);
    };
    return (
        <div className="gameOver">
            <p>Game Over!</p>
            <p>Final score: {props.score}</p>
            <button onClick={refresh}>Try again?</button>
        </div>
    );
}

export default GameOver;
