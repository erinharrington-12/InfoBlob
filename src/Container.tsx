import * as React from 'react';
import { App } from './App';
import * as Sim from './Sim';
import WorkerInstance from './WorkerInstance';
import { RobotState } from './RobotState';
import * as Babylon from 'babylonjs';
import { SimulatorArea } from './SimulatorArea';

export interface ContainerProps { }
interface ContainerState {
	robot: RobotState,
	isCanChecked: boolean[],
}
type Props = ContainerProps;
type State = ContainerState;

class Collapsible extends React.Component {
	private open;
	private title;
	constructor(props) {
		super(props);
		this.state = {
			open: this.open
		}
		this.togglePanel = this.togglePanel.bind(this);
	}

	togglePanel(e) {
		this.setState({open: !this.open});
		this.open = !this.open;
	}

	componentDidUpdate() {

	}

	render() {
		return (<div>
			<div onClick={(e) => this.togglePanel(e)} className='header'>Cans</div>
			{this.open ? (
				<div className='content'>
					{this.props.children}
				</div>
			) : null}
		</div>);
	}
}


export class Container extends React.Component<Props, State> {
	constructor(props: Props, context?) {
		super(props, context)
		this.state = {
			robot: WorkerInstance.state,
			isCanChecked: Array<boolean>(12).fill(false),
		}
	}
	private onStateChange = (state: RobotState) => {
		//console.log('state change'); 
		this.setState({
			robot: state
		});

	}
	private space: Sim.Space = null;

	componentWillMount() {
		WorkerInstance.onStateChange = this.onStateChange
	}

	private onRobotChange_ = (robot: RobotState) => {
		WorkerInstance.state = robot;
	};

	private onCheckBoxActivity = (event: React.ChangeEvent<HTMLInputElement>) => {
		//canItem.setEnabled(checkbox.checked);
		const canNumber = Number.parseInt(event.target.value);
		const isTargetChecked = event.target.checked;

		this.setState(prevState => {
			let isCanChecked = [...prevState.isCanChecked];
			isCanChecked[canNumber] = isTargetChecked;
			return { isCanChecked };
		});
	}

	render() {
		const {
			props, state
		} = this

		return (
			<div id="main">
				<div id="root">
					<section id="app">
						<App robot={state.robot} onRobotChange={this.onRobotChange_} />
						<Collapsible>
							<ul>
								{[...Array(12)].map((_, i) =>
									<li key={i + 1}>
										<input type="checkbox" name="can" value={i} checked={state.isCanChecked[i]} onChange={this.onCheckBoxActivity} />
										<label>{`Can ${i + 1}`}</label>
									</li>
								)}
							</ul>
						</Collapsible>
					</section>
				</div>
				<div id="right">
					<SimulatorArea canEnabled={state.isCanChecked} />
				</div>
			</div>
		)
	}
}

//All logic inside of index.tsx