import Board from '../game/components/Board';
import React from 'react';
import AnimationContainer from './components/AnimationContainer';

const Game = () => {
	return <div className='relative w-screen h-screen align-webkit-center'>
		<AnimationContainer />
		<Board />
	</div>;
};

export default Game;