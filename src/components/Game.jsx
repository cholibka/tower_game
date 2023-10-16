import { Canvas } from "@react-three/fiber";
import Box from "./Box";
import "./Game.css";
import { useState, cloneElement, useRef } from "react";
import Score from "./Score";
import GameOver from "./GameOver";
import { isMobile } from "react-device-detect";

function Game() {
    const boxHeight = 1;
    const boxSize = useRef([3, boxHeight, 3]);
    const scaleVector = useRef([1, 1, 1]);
    const positionVector = useRef([0, 0, 0]);
    const [gameStarted, setGameStarted] = useState(false);
    const [direction, setDirection] = useState("z");
    const [boxesOnCanvas, setBoxesOnCanvas] = useState([
        <Box
            position={positionVector.current}
            size={boxSize.current}
            color="hsl(300, 100%, 50%)"
            key={0}
            id={0}
            direction={"z"}
            animation={false}
            scale={scaleVector.current}
        />,
    ]);
    const gameOver = useRef(false);

    const calculatePosition = (currentBoxDirection, value, delta, v) => {
        const newPositionX =
            currentBoxDirection === 0
                ? value[0] - delta / 2
                : v === false
                ? value[0]
                : 0;
        const newPositionZ =
            currentBoxDirection === 2
                ? value[2] - delta / 2
                : v === false
                ? value[2]
                : 0;

        return [newPositionX, v === false ? value[1] : 0, newPositionZ];
    };

    const checkPosition = (value) => {
        setBoxesOnCanvas((prevBoxesOnCanvas) => {
            return prevBoxesOnCanvas.map((box) => {
                if (box.props.id === boxesOnCanvas.length) {
                    const prevBox = boxesOnCanvas[box.props.id - 1];
                    value = Array.from(value);
                    const currentBoxDirection =
                        box.props.direction == "x" ? 0 : 2;
                    let prevBoxEndVector =
                        prevBox.props.position[currentBoxDirection] +
                        prevBox.props.size[currentBoxDirection] / 2;
                    let currentBoxStartVector =
                        value[currentBoxDirection] -
                        box.props.size[currentBoxDirection] / 2;

                    if (currentBoxStartVector > prevBoxEndVector) {
                        gameOver.current = true;
                        return cloneElement(box, {
                            animation: false,
                        });
                    }
                }
                return box;
            });
        });
    };

    const changePosition = (value) => {
        setBoxesOnCanvas((prevBoxesOnCanvas) => {
            return prevBoxesOnCanvas.map((box) => {
                if (box.props.id === boxesOnCanvas.length) {
                    const prevBox = boxesOnCanvas[box.props.id - 1];
                    value = Array.from(value);
                    const currentBoxDirection =
                        box.props.direction == "x" ? 0 : 2;
                    const delta =
                        value[currentBoxDirection] -
                        prevBox.props.position[currentBoxDirection];
                    const overhangSize = Math.abs(delta);
                    const size = box.props.size[currentBoxDirection];
                    const overlap = size - overhangSize;

                    if (overlap > 0) {
                        const newX =
                            currentBoxDirection === 0
                                ? overlap
                                : box.props.size[0];
                        const newZ =
                            currentBoxDirection === 2
                                ? overlap
                                : box.props.size[2];

                        let v;
                        const newPosition = calculatePosition(
                            currentBoxDirection,
                            value,
                            delta,
                            (v = false)
                        );

                        positionVector.current = calculatePosition(
                            currentBoxDirection,
                            value,
                            delta,
                            (v = true)
                        );

                        const scale = [
                            currentBoxDirection === 0
                                ? overlap / size
                                : scaleVector.current[0],
                            scaleVector.current[1],
                            currentBoxDirection === 2
                                ? overlap / size
                                : scaleVector.current[2],
                        ];
                        boxSize.current = [newX, boxHeight, newZ];
                        return cloneElement(box, {
                            position: newPosition,
                            scale: scale,
                            stopInfiniteLoop: true,
                        });
                    } else {
                        gameOver.current = true;
                    }
                }
                return box;
            });
        });
    };

    function timeout(delay) {
        return new Promise((res) => setTimeout(res, delay));
    }

    const AddToStack = async () => {
        if (!gameStarted) setGameStarted(true);
        const y = boxHeight * boxesOnCanvas.length;
        const x = direction == "x" ? 0 : -10;
        const z = direction == "z" ? 0 : -10;

        if (boxesOnCanvas.length > 1) {
            setBoxesOnCanvas((prevBoxesOnCanvas) => {
                return prevBoxesOnCanvas.map((box) => {
                    if (box.props.id === boxesOnCanvas.length - 1) {
                        return cloneElement(box, {
                            animation: false,
                        });
                    }
                    return box;
                });
            });
        }

        await timeout(100);
        if (!gameOver.current) {
            console.log(gameOver.current);
            setBoxesOnCanvas((prevBoxesOnCanvas) => [
                ...prevBoxesOnCanvas,
                <Box
                    position={[
                        x + positionVector.current[0],
                        y,
                        z + positionVector.current[2],
                    ]}
                    size={boxSize.current}
                    color={`hsl(${300 + boxesOnCanvas.length * 8}, 100%, 50%)`}
                    key={boxesOnCanvas.length}
                    id={boxesOnCanvas.length}
                    direction={direction == "z" ? "x" : "z"}
                    animation={true}
                    changePosition={changePosition}
                    scale={scaleVector.current}
                    checkPosition={checkPosition}
                />,
            ]);
            setDirection((direction) => (direction == "z" ? "x" : "z"));
        }
    };

    return (
        <div className="game_container">
            <Score
                score={
                    boxesOnCanvas.length - 2 >= 0 ? boxesOnCanvas.length - 2 : 0
                }
            />
            {!gameStarted ? <p className="startGame">Click to start!</p> : null}
            <Canvas
                orthographic
                camera={{ position: [4, 4, 4], zoom: isMobile ? 75 : 100 }}
                onClick={AddToStack}
            >
                <ambientLight color={0xffffff} intensity={0.6} />
                <directionalLight
                    color={0xffffff}
                    intensity={0.6}
                    position={[20, 10, 0]}
                />
                {boxesOnCanvas}
            </Canvas>
            {gameOver.current ? (
                <GameOver
                    score={
                        boxesOnCanvas.length - 2 >= 0
                            ? boxesOnCanvas.length - 2
                            : 0
                    }
                />
            ) : null}
        </div>
    );
}

export default Game;
