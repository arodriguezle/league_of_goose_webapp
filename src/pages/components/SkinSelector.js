import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

import SkinSlide from './SkinSlide';
import { useState, useEffect } from "react";

const SkinSelector = (props) => {
	const [availableSkins, setAvailableSkins] = useState([])
	useEffect(() => {
		setAvailableSkins(props.skins)
	}, [props.skins])

	return (
		<div className='flex flex-row justify-center'>
			<Swiper
				modules={[Pagination, A11y]}
				spaceBetween={50}
				slidesPerView={1}
				onSlideChange={(swiper) => {
					const index = swiper.activeIndex
					console.log(index)
					if (props.setSelectedDiceSkin) {
						props.setSelectedDiceSkin(index)
					}
					if (props.setSelectedGooseSkin) {
						props.setSelectedGooseSkin(index)
					}
				}}
				pagination={{ clickable: true }}
			>
				{availableSkins.map((skin, i) => (
					<SwiperSlide key={i}>
						<div className='h-[50vh]'>
							<SkinSlide skin={skin} is_dice={props.setSelectedDiceSkin ? true : false} is_goose={props.setSelectedGooseSkin ? true : false} />
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
export default SkinSelector;