import React from 'react';
import './schedule-div.styles.scss';
import axios from "axios";
import C from "../../resources/values";
import plus from '../../assets/images/plus.png';
import remove from '../../assets/images/remove.png';

class ScheduleDiv extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			date:0,
			month:0,
			year:0,
			schedule:[],
			teacherName:"",
			teacherSubject:"",
			startHour:"00",
			startMinutes:"00",
			endHour:"00",
			endMinutes:"00",
			searchField:"",
			textDate:""
		}
		this.close = this.close.bind(this);
		this.schedule = this.schedule.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.searchTeacher = this.searchTeacher.bind(this);
		this.shouldInclude = this.shouldInclude.bind(this);
		this.timeOverlap = this.timeOverlap.bind(this);
	}

	componentWillReceiveProps = (event) =>{
		if(this.state.textDate!==this.props.text){
			this.setState({
				date: this.props.date,
				month:this.props.month,
				year:this.props.year,
			},()=>{
				console.log(this.state);
				let schedule = axios.get(C.SERVER_CALL+`/teacher/getSchedule/${this.state.date}/${this.state.month}/${this.state.year}`);
				schedule.then(result => {this.setState({schedule:result.data.schedule})}).catch(err=>{console.log(err)});
			});
		}
		if(this.props.getWeekSchedule){
			let schedule = axios.get(C.SERVER_CALL+`/teacher/getWeekShedule/${this.state.date}/${this.state.month}/${this.state.year}/${this.props.nextWeek}/${this.props.nextMonth}/${this.props.nextYear}`);
			schedule.then(result => {this.setState({schedule:result.data.schedule})}).catch(err=>{console.log(err)});
		}
		if(this.props.getMonthSchedule){
			let schedule = axios.get(C.SERVER_CALL+`/teacher/getMonthShedule/${this.state.date}/${this.state.month}/${this.state.year}/${this.props.nextMonth}/${this.props.nextYear}`);
			schedule.then(result => {this.setState({schedule:result.data.schedule})}).catch(err=>{console.log(err)});
		}
	}

	close(){
		var form = document.getElementById("hidden");
		form.style.display="none";
	}

	schedule(){
		var form = document.getElementById("hidden");
		form.style.display="block";
	}

	timeOverlap = (first,second) =>{
		const getMinutes = (st) =>{
			const time = st.split(':').map(Number);
			return time[0]*60+time[1];
		}
		return getMinutes(first[1]) > getMinutes(second[0]) && getMinutes(second[1]) > getMinutes(first[0]);
	}

	shouldInclude = () =>{
		for(var i=0;i<this.state.schedule.length;i++){
			if(this.state.schedule[i].name===this.state.teacherName&&this.state.schedule[i].subject===this.state.teacherSubject){
				var string1 = this.state.schedule[i].startHour+':'+this.state.schedule[i].startMinutes;
				var string2 = this.state.schedule[i].endHour+':'+this.state.schedule[i].endMinutes;
				var string3 = this.state.startHour+':'+this.state.startMinutes;
				var string4 = this.state.endHour+':'+this.state.endMinutes;
				const arr1=[string1, string2];
				const arr2=[string3, string4];
				if(this.timeOverlap(arr1,arr2)){
					return true;
				}
			}
		}
		return false;
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		if(!this.shouldInclude()){
			let item = {
		      name: this.state.teacherName,
		      subject: this.state.teacherSubject,
		      startHour: this.state.startHour,
		      startMinutes: this.state.startMinutes,
		      endHour:this.state.endHour,
		      endMinutes: this.state.endMinutes,
		      date: this.state.date,
		      month: this.state.month,
		      year:this.state.year,
		    };
		    let newSchedule = await axios.post(
		      C.SERVER_CALL + '/teacher/addschedule',
		      item
		    );

		    this.setState({
		    	schedule:newSchedule.data.schedule,
		    	teacherName:"",
				teacherSubject:"",
				startHour:"00",
				startMinutes:"00",
				endHour:"00",
				endMinutes:"00",
		    });
		}
		else{
			alert("The Schedule time Overlaps. Please choose another slot");
			this.setState({
		    	teacherName:"",
				teacherSubject:"",
				startHour:"00",
				startMinutes:"00",
				endHour:"00",
				endMinutes:"00",
		    });
		}
	}

	handleChange(event){
		const {name, value} = event.target;
		this.setState({[name]:value});
	}

	searchTeacher = async () => {
		console.log(this.state.searchField);
		if(this.state.searchField===""){
			let schedule = await axios.get(C.SERVER_CALL + '/teacher/getSchedule');
			console.log(schedule);
			this.setState({schedule:schedule.data.schedule});
		}
		else{
			let item = await axios.get(C.SERVER_CALL + `/teacher/getTeacher/${this.state.searchField}`);
				this.setState({schedule:item.data.schedule},()=>{
				console.log(this.state.schedule);
			});
		}
	}

	deleteSchedule = async(event) =>{
		let schedule = this.state.schedule;
	    for (let i = 0; i < schedule.length; i++){
	      if (schedule[i]._id === event) {
	        schedule.splice(i, 1);
	        break;
	      }
	  	}
	    this.setState({ schedule: schedule },()=>{
	    	console.log(this.state.schedule);
	    });
		await axios.delete(C.SERVER_CALL + `/teacher/deleteSchedule/${event}`);
	}

	render(){
		return(
			<div>
			<form className="scheduleForm">
				<input 
				type="text" 
				placeholder="Enter Teacher's Name" 
				className="form" 
				onChange={this.handleChange}
				name="searchField"
				/>
				<div onClick={this.searchTeacher} className="submitButton">
					Filter Results
				</div>
			</form>	
			<div className="mainSchedule">
				<div className="SampleSchedule" onClick={this.schedule}>
					<img src ={plus} alt='Add Schedule' className="image"/>
				</div>
				{
					this.state.schedule.length > 0 ? (
						<div style={{display:"flex", flexWrap:"wrap"}}>
						{this.state.schedule.map((c) => (
							<div key={c._id} className = "schedule">
								<div className="remove" onClick={()=>{this.deleteSchedule(c._id)}}>
									<img className="delete" alt="delete" src={remove}/>
								</div>
								<div>
									<span>Date : {c.date}/{c.month}/{c.year}</span><br/>
									<span>Teacher Name : {c.name}</span><br/>
									<span>Teacher Teacher : {c.subject}</span><br/>
									<span>Class Start Time : {c.startHour}:{c.startMinutes}</span><br/>
									<span>Class End Time : {c.endHour}:{c.endMinutes}</span><br/>
								</div>
							</div>
						))}
						</div>
					):(
					<></>
					)
				}
			</div>
			<form onSubmit={this.handleSubmit} className="scheduleForm" id="hidden">
				<label className="label">Teacher's name</label>
				<br/>
				<input type="text" className="form" name="teacherName" onChange={this.handleChange} placeholder={this.state.teacherName} required/>
				<br/>
				<label className="label">Subject</label>
				<br/>
				<input type="text" className="form" name="teacherSubject" onChange={this.handleChange} placeholder={this.state.teacherSubject} required/>
				<br/>
				<label className="label">Lecture Start Time (hours)</label>
				<br/>
				<input type="text" className="form" name="startHour" onChange={this.handleChange} placeholder={this.state.startHour} required/>
				<br/>
				<label className="label">Lecture Start Time (Minutes)</label>
				<br/>
				<input type="text" className="form" name="startMinutes" onChange={this.handleChange} placeholder={this.state.startMinutes} required/>
				<br/>
				<label className="label">Lecture End Time (Hours)</label>
				<br/>
				<input type="text" className="form" name="endHour" onChange={this.handleChange} placeholder={this.state.endHour} required/>
				<br/>
				<label className="label">Lecture End Time (Minutes)</label>
				<br/>
				<input type="text" className="form" name="endMinutes" onChange={this.handleChange} placeholder={this.state.endMinutes} required/>
				<br/>
				<button onClick= {this.close} type="submit" className="submitButton"> 
					Add Schedule 
				</button>
			</form>
			<div className="scheduler" onClick={this.schedule}>
			Add Schedule
			</div>
		</div>
		);
	}
}

export default ScheduleDiv;