import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Box(props) {
    const meshRef = useRef();
    const speed = 0.15;
    let wasStopped = false;

    useFrame((state) => {
        state.camera.position.lerp({ x: 4, y: 4 + props.id, z: 4 }, 0.5);
        state.camera.lookAt(0, props.id, 0);

        if (props.id > 0)
            if (props.animation === true) {
                meshRef.current.position[props.direction] += speed;
            } else if (
                wasStopped === false &&
                props.stopInfiniteLoop === undefined
            ) {
                {
                    wasStopped = true;
                    props.changePosition(meshRef.current.position);
                }
            }
    });

    return (
        <mesh position={props.position} ref={meshRef} scale={props.scale}>
            <boxGeometry args={props.size} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
}

export default Box;
