import { Canvas, useThree, useFrame } from "@react-three/fiber";
import Box from "./Box";
import "./Game.css";
import { useState, useEffect, cloneElement } from "react";

function Game() {
    const boxHeight = 1;
    const scale = [1, 1, 1];
    const [gameStarted, setGameStarted] = useState(false);
    const [direction, setDirection] = useState("z");
    const [boxesOnCanvas, setBoxesOnCanvas] = useState([
        <Box
            position={[0, 0, 0]}
            size={[3, boxHeight, 3]}
            color="hsl(300, 100%, 50%)"
            key={0}
            length={0}
            direction={"z"}
            animation={true}
            scale={scale}
        />,
    ]);
    const [boxSize, setBoxSize] = useState([3, boxHeight, 3]);

    const changePosition = (value) => {
        setBoxesOnCanvas((prevBoxesOnCanvas) => {
            return prevBoxesOnCanvas.map((box) => {
                if (box.props.length === boxesOnCanvas.length) {
                    let prevBox = boxesOnCanvas.find((b) => {
                        return b.props.length === boxesOnCanvas.length - 1;
                    });
                    console.log(prevBox);
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
                        // setBoxSize([newX, boxHeight, newZ]);
                        const newXScale =
                            currentBoxDirection === 0
                                ? overlap / size
                                : scale[0];
                        const newZScale =
                            currentBoxDirection === 2
                                ? overlap / size
                                : scale[2];

                        const newPX =
                            currentBoxDirection === 0
                                ? value[0] - delta / 2
                                : value[0];
                        const newPZ =
                            currentBoxDirection === 2
                                ? value[2] - delta / 2
                                : value[2];
                        return cloneElement(box, {
                            // position: [newPX, value[1], newPZ],
                            // scale: [newXScale, scale[1], newZScale],
                        });
                    }
                }
                return box;
            });
        });
    };

    const AddToStack = () => {
        if (!gameStarted) setGameStarted(true);

        const y = boxHeight * boxesOnCanvas.length;
        const x = direction == "x" ? 0 : -10;
        const z = direction == "z" ? 0 : -10;

        setBoxesOnCanvas((prevBoxesOnCanvas) => [
            ...prevBoxesOnCanvas,
            <Box
                position={[x, y, z]}
                size={boxSize}
                color={`hsl(${300 + boxesOnCanvas.length * 8}, 100%, 50%)`}
                key={boxesOnCanvas.length}
                length={boxesOnCanvas.length}
                direction={direction == "z" ? "x" : "z"}
                animation={true}
                changePosition={changePosition}
                scale={scale}
            />,
        ]);
        setDirection((direction) => (direction == "z" ? "x" : "z"));

        if (boxesOnCanvas.length > 1) {
            setBoxesOnCanvas((prevBoxesOnCanvas) => {
                return prevBoxesOnCanvas.map((box) => {
                    if (box.props.length === boxesOnCanvas.length - 1) {
                        return cloneElement(box, {
                            animation: false,
                        });
                    }
                    return box;
                });
            });
        }
    };

    return (
        <div className="game_container">
            <Canvas
                orthographic
                camera={{ position: [4, 4, 4], zoom: 100 }}
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
        </div>
    );
}

export default Game;
