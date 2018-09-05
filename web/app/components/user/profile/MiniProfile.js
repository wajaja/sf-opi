import React 				from 'react'
import createReactClass 	from 'create-react-class'


const MiniProfile = createReactClass({

	getInitialState() {
		return{

		}
	},

	render() {
		'<div class="min-prof-a" id="">'+
	'<div class="min-prof-b" id="">'+
		'<div class="min-prof-pic-a" id="">'+
                    '<div class="min-prof-pic-b" id="">'+
                        '<span class="min-conver-ctnr" id="">'+
                            '<a href="#animatedModal" class="hm-edt-cov-pic" id="hm-edt-cov-pic"><i class="fa fa-pencil" aria-hidden="true"></i></a>'+
                            '<img src="{{asset (user.coverPic.croppedPath|default("/images/favicon.ico"))}}" class="min-conver" />'+
                        '</span>'+
                        '<span class="mn-pic-ctnr">'+ 
                            '<a href="" class="hm-edt-prof-pic" id="hm_edt_prof_pic"><i class="fa fa-pencil" aria-hidden="true"></i></a>'+                    
                            '<span class="min-pic-container" id="">'+
                                '<img src="{{asset (user.profilePic.croppedPath|default("/images/favicon.ico"))}}" class="min-pic-img" />'+
                            '</span>'+
                        '</span>'+
                        '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="min-nm-lk">'+
                            '<span class="min-prof-name" id="">{{app.user.firstname}}</span>'+                    
                        '</a>'+
                        '<a href="" class="hm-prof-conf">'+
                            '<i class="fa fa-cog" aria-hidden="true"></i>'+
                            '<span class="hm-prof-conf-txt">Parameters</span>'+
                        '</a>'+
                    '</div>'+
		'</div>'+
		'<div class="min-prof-not" id="">'+
            '<div class="min-prof-not-a" id="">'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-edit-stt-lk">'+
                    '<i class="fa fa-quote-left" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Status</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-g-inbox">'+
                    '<i class="fa fa-envelope" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Inbox</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-g-group">'+
                    '<i class="fa fa-users" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Groups</span>'+
                '</a>'+
            '</div>'+
			'<div class="min-prof-not-b" id="">'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-g-notifs">'+
                    '<i class="fa fa-bell" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Notifications</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-opn-question">'+
                    '<i class="fa fa-question-circle" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Questions</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-opn-favoris">'+
                    '<i class="fa fa-star" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Favoris</span>'+
                '</a>'+
			'</div>'+
			'<div class="min-prof-not-c" id="">'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-g-invits">'+
                    '<i class="fa fa-user-plus" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Invitations</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-opn-frd">'+
                    '<i class="fa fa-user" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Friends</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-opn-flw">'+
                    '<i class="fa fa-user" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Followers</span>'+
                '</a>'+
                '<a href="{{ path('fos_user_profile_show', {'username': app.user.username}) }}" class="hm-g-pop-usr">'+
                    '<i class="fa fa-user" aria-hidden="true"></i>'+
                    '<span class="min-prof-not-child" id="">Popularities</span>'+
                '</a>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
''

	}
})