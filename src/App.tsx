import { useEffect, useMemo, useState } from 'react';

const localIs2PartialsShown = localStorage.getItem('is2PartialsShown');
const localInputValues2Partials = localStorage.getItem('inputValues2Partials');
const localInputValues3Partials = localStorage.getItem('inputValues3Partials');

const defaultState2Partials = {
	p2rr1: 2,
	p2rr2: 5,
	p2fixSizePercent1: 80,
};

const defaultState3Partials = {
	p3rr1: 2,
	p3rr2: 3,
	p3rr3: 5,
	p3fixSizePercent1: 50,
	p3fixSizePercent2: 30,
};

export const App = () => {
	const [is2PartialsShown, setIs2PartialsShown] = useState(
		localIs2PartialsShown ? JSON.parse(localIs2PartialsShown) : true
	);
	const [inputValues2Partials, setInputValues2Partials] = useState(
		localInputValues2Partials
			? JSON.parse(localInputValues2Partials)
			: defaultState2Partials
	);
	const [inputValues3Partials, setInputValues3Partials] = useState(
		localInputValues3Partials
			? JSON.parse(localInputValues3Partials)
			: defaultState3Partials
	);
	const { p2rr1, p2rr2, p2fixSizePercent1 } = inputValues2Partials;
	const { p3rr1, p3rr2, p3rr3, p3fixSizePercent1, p3fixSizePercent2 } =
		inputValues3Partials;
	const roundNum = (value: number) => Math.round(value * 100) / 100;

	const profit2Partials = useMemo(
		() =>
			roundNum(
				(p2rr1 / 100) * p2fixSizePercent1 +
					(p2rr2 / 100) * (100 - p2fixSizePercent1)
			),
		[p2rr1, p2rr2, p2fixSizePercent1]
	);
	const profit3Partials = useMemo(
		() =>
			roundNum(
				(p3rr1 / 100) * p3fixSizePercent1 +
					(p3rr2 / 100) * (100 - p3fixSizePercent1) +
					(p3rr3 / 100) * (100 - p3fixSizePercent1 - p3fixSizePercent2)
			),
		[p3rr1, p3rr2, p3rr3, p3fixSizePercent1, p3fixSizePercent2]
	);

	useEffect(() => {
		localStorage.setItem(
			'inputValues2Partials',
			JSON.stringify(inputValues2Partials)
		);
		localStorage.setItem(
			'inputValues3Partials',
			JSON.stringify(inputValues3Partials)
		);
	}, [inputValues2Partials, inputValues3Partials]);

	const validate2Partials = () => {
		if (p2rr1 >= p2rr2) {
			setInputValues2Partials({
				...inputValues2Partials,
				p2rr1: roundNum(p2rr2 - 0.01),
			});
		}
		if (p2rr2 <= p2rr1) {
			setInputValues2Partials({
				...inputValues2Partials,
				p2rr2: roundNum(p2rr1 + 0.01),
			});
		}
	};

	const validate3Partials = () => {
		if (p3rr1 >= p3rr2) {
			setInputValues3Partials({
				...inputValues3Partials,
				p3rr1: roundNum(p3rr2 - 0.01),
			});
		}
		if (p3rr2 <= p3rr1) {
			setInputValues3Partials({
				...inputValues3Partials,
				p3rr2: roundNum(p3rr1 + 0.01),
			});
		}
		if (p3rr2 >= p3rr3) {
			setInputValues3Partials({
				...inputValues3Partials,
				p3rr2: roundNum(p3rr3 - 0.01),
			});
		}
		if (p3rr3 <= p3rr2) {
			setInputValues3Partials({
				...inputValues3Partials,
				p3rr3: roundNum(p3rr2 + 0.01),
			});
		}
	};

	useEffect(() => {
		validate2Partials();
	}, [inputValues2Partials]);

	useEffect(() => {
		validate3Partials();
	}, [inputValues3Partials]);

	const renderInput = (
		mainState: '2p' | '3p',
		valueName: string,
		label: string
	) => {
		if (mainState === '2p') {
			return (
				<div>
					<label htmlFor={valueName}>{label}</label>
					<input
						id={valueName}
						name={valueName}
						min={1}
						max={100}
						type="number"
						// @ts-ignore
						value={inputValues2Partials[valueName]}
						onChange={(event) =>
							setInputValues2Partials({
								...inputValues2Partials,
								[valueName]: event.target.value && Number(event.target.value),
							})
						}
					/>
				</div>
			);
		}
		if (mainState === '3p') {
			return (
				<div>
					<label htmlFor={valueName}>{label}</label>
					<input
						id={valueName}
						name={valueName}
						min={1}
						max={100}
						type="number"
						// @ts-ignore
						value={inputValues3Partials[valueName]}
						onChange={(event) =>
							setInputValues3Partials({
								...inputValues3Partials,
								[valueName]:
									Number(event.target.value) > 0
										? Number(event.target.value)
										: 1,
							})
						}
					/>
				</div>
			);
		}
	};

	return (
		<div>
			<iframe frameBorder="0" width="400" height="900" src="./calc.html" />
			<section>
				<article>
					<button
						title="Click to switch from 2 to 3 partials and vice versa"
						onClick={() => {
							setIs2PartialsShown(!is2PartialsShown);
							localStorage.setItem(
								'is2PartialsShown',
								JSON.stringify(!is2PartialsShown)
							);
						}}
					>
						<img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-link-7.png" />
					</button>
				</article>
				{is2PartialsShown ? (
					<>
						{renderInput('2p', 'p2rr1', '1st Take Profit')}
						{renderInput('2p', 'p2rr2', '2nd Take Profit')}
						{renderInput('2p', 'p2fixSizePercent1', '1st Take Profit Fix %')}
						<div>
							<p>Estimated profit</p>
							<h2>{profit2Partials}</h2>
						</div>
					</>
				) : (
					<>
						{renderInput('3p', 'p3rr1', '1st Take Profit')}
						{renderInput('3p', 'p3rr2', '2nd Take Profit')}
						{renderInput('3p', 'p3rr3', '3rd Take Profit')}
						{renderInput('3p', 'p3fixSizePercent1', '1st Take Profit Fix %')}
						{renderInput('3p', 'p3fixSizePercent2', '2nd Take Profit Fix %')}
						<div>
							<p>Estimated profit</p>
							<h2>{profit3Partials}</h2>
						</div>
					</>
				)}
			</section>
		</div>
	);
};
