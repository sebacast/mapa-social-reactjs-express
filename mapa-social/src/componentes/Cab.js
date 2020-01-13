
import React, { Component } from 'react';
import NotiContactos from './NotiContactos';
class Cab extends Component {
	render() {
		return (
			<header class="header">
				<div class="logo-container">
					<a href class="logo">
						<img src="logo.png" height="35" alt="JSOFT Admin" />
					</a>
					<div class="visible-xs toggle-sidebar-left" data-toggle-class="sidebar-left-opened" data-target="html" data-fire-event="sidebar-left-opened" >
						<i class="fa fa-bars" aria-label="Toggle sidebar"></i>
					</div>
				</div>
				<div class="header-right">
				  
				   <NotiContactos  />
					 <span class="separator"></span>
				</div>
			</header>
		);
	}
}
export default Cab;
