console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  $('body').on('click', '.readyToTransferButton', readyToTransferButton);
  $('body').on('click', '.deleteButton', deleteButton);
  // Establish Click Listeners
  setupClickListeners()
  getKoalas();
  // load existing koalas on page load

}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
  let newName = $('#newNameIn').val();
  let newAge = $('#newAgeIn').val();
  let newGender = $('#newGenderIn').val();
  let newReadyForTransfer = $('#newReadyForTransferIn').val();
  let newNotes = $('#newNotesIn').val();

  let koalaToSend = {
    name: newName,
    age: newAge,
    gender: newGender,
    readyForTransfer: newReadyForTransfer,
    notes: newNotes
  }
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); 
}

function getKoalas(){
  console.log( 'in getKoalas' );
  $.ajax({
    type: 'GET',
    url: '/koalas'
    }).then(function(response) {
      $('#viewKoalas').empty();

      for (let koala of response) {

        if (koala.ready_to_transfer === 'Y') {
        $('#viewKoalas').append(`
        <tr data-id =${koala.id}>
          <td>${koala.name}</td>
          <td>${koala.age}</td>
          <td>${koala.gender}</td>
          <td>${koala.ready_to_transfer}</td>
          <td>${koala.notes}</td>
          <td><button class = "deleteButton">Delete</button></td>
          </tr>
          `);
        } 
        else {
          $('#viewKoalas').append(`
        <tr data-id =${koala.id}>
          <td>${koala.name}</td>
          <td>${koala.age}</td>
          <td>${koala.gender}</td>
          <td>${koala.ready_to_transfer}</td>
          <td>${koala.notes}</td>
          <td><button class= "readyToTransferButton">Ready to Transfer</button></td>
          <td><button class = "deleteButton">Delete</button></td>
          `)}
        }
    }).catch(function(error) {
      console.log('Error in GET', error)
      alert('Unable to add book at this time. Please try again later.');
    });
} // end getKoalas


function saveKoala( newKoala ){
console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    type: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(function(response) {
    console.log('Response from server.', response);
    getKoalas();
  }).catch(function(error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time.');
  })

}

function readyToTransferButton() {
  let idToUpdate = $(this).parent().parent().data().id;

  $.ajax({
    method: 'PUT',
    url: `/koalas/${idToUpdate}`,
    data: {
      ready_to_transfer: 'Y'
    }
  }).then((response) => {
    getKoalas();
  }).catch((error) => {
    console.log('Something went wrong in readyToTransferButton:', error)
  })
}//end of readyToTransferButton

function deleteButton() {
  let idToDelete = $(this).parent().parent().data().id;

  $.ajax({
    method: 'DELETE',
    url: `/koalas/${idToDelete}`
  }).then((response) => {
    getKoalas();
  }).catch((error) => {
    console.log('Something went wrong with deleteButton:', error);
  })
}