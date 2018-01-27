//Global variables
let index;
let chosenModal;
let currentModal;
let prevModal;
let nextModal;
let modalNum;
let empCardArray =[];
let employeeArray = [];
let nameArray = [];
let search;
let counter;

$('#overlay').hide();


function capitalize(str){
    return str.replace(/\w\S*/g, function(txt){
    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function abbrState(input) {
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];
  
    input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    for(i = 0; i < states.length; i++){
        if(states[i][0] == input){
            return(states[i][1]);
        }
    }   
}

$.ajax("https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,phone,picture",
	{
		dataType: 'json',
		success: function(data) {
			let employees = data.results;
			$.each(employees, function(i, employee) {

				//variables 
				let firstName = capitalize(`${employee.name.first}`);
				let lastName = capitalize(`${employee.name.last}`);
				let capName = `${firstName} ${lastName}`;
				let capCity = capitalize(`${employee.location.city}`);
				let street = capitalize(`${employee.location.street}`);
				let state = abbrState(`${employee.location.state}`);
				let bday = new Date(Date.parse(`${employee.dob}`)).toLocaleDateString('en-US');
				
				//build the HTML
				$('#directory').append(
					`<div class="empCard">
						<img class="picture" src="${employee.picture.medium}">
						<div class="empDiv">
							<p class="empName">${capName}</p>
							<p class="empInfo">${employee.email}</p>
							<p class="empInfo">${capCity}</p>
						</div>
					</div>

					<div class="modal ${i}">
						<div class="modalNav">
							<span id="previous">previous</span>
							<span id="close">close</span>
							<span id="next">next</span>
						</div>
						<div class="modalTop">
							<img class="picture" src="${employee.picture.large}">
							<p class="empName">${capName}</p>
							<p class="empInfo">${employee.email}</p>
							<p class="empInfo">${capCity}</p>
						</div>
						<div class="modalBottom">
							<span class="empInfo">${employee.phone}</span>
							<span class="empInfo">${street}, ${state} ${employee.location.postcode}</span>
							<span class="empInfo">Birthday: ${bday}</span>
						</div>
					</div>`
					); //end append
			}); //end loop	

			//Bring up the modals
			$('.modal').hide();
			$('.empCard').click(function() {
				$(window).scrollTop(0);
				$('#overlay').fadeIn(600);
				let chosenEmp = this;
				let empArray = $('.empCard');
				for(let i = 0; i < empArray.length; i++) {
					if(empArray[i] === chosenEmp) {
						index = i;
						chosenModal = $('.modal')[index];
					}
				}		
				$(chosenModal).fadeIn(600);
			}); //end empCard click listener

			//Navigate through the modals
			$('.modalNav').click(function(e) {
				let target = e.target;
				if($(target).text() === "close") {
					$(this).parent().fadeOut(600);
					$('#overlay').fadeOut(600);
				} else if($(target).text() === "previous") {
					$.each($('.modal'), function(i) {
						if($(this).is(":visible")) {
							currentModal = this;
							modalNum = i;
						}
					});
					$.each($('.modal'), function(i) {	
						let prevNum = modalNum - 1;
						if($(this).hasClass(prevNum)) {
							prevModal = this;
						}
					});
					$(currentModal).fadeOut(600);
					$(prevModal).fadeIn(600);
				} else if($(target).text() === "next") {
					$.each($('.modal'), function(i) {
						if($(this).is(":visible")) {
							currentModal = this;
							modalNum = i;
						}
					});
					$.each($('.modal'), function(i) {	
						let nextNum = modalNum + 1;
						if($(this).hasClass(nextNum)) {
							nextModal = this;
						}
					});
					$(currentModal).fadeOut(600);
					$(nextModal).fadeIn(600);
				}
			});//end modalNav click

			//Employee Search Box

			$.each($('.empCard'), function() {
				empCardArray.push(this);
			});

			$.each($('.empDiv .empName'), function() {
				employeeArray.push(this);
			});

			$.each(employeeArray, function() {
				nameArray.push($(this).text().toLowerCase());
			});

			$('#search').keyup(function() {
				counter = 0;
				$('#alert').remove();
				search = $('#search').val().toLowerCase();
				$.each(nameArray, function(i) {
					let match = nameArray[i].indexOf(search);
					if( match === -1) {
						$(empCardArray[i]).fadeOut(600);
					} else {
						$(empCardArray[i]).fadeIn(600);
					}
				}); //end each loop
				setTimeout(function() {
					$.each(empCardArray, function(i) {
						if($(this).is(":visible")) {
							counter += 1;
						}
					}); //end each loop
					console.log(counter);
					if(counter === 0) {
						$('#directory').append(`
						<div id="alert">
							<p>I'm sorry, we don't have any employees matching that name.</p>
						</div>`);
					}
				}, 800);
			}) //end keyup listener
		} //end success callback
	} //end settings
); //end ajax

