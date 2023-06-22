const defaultUrl = 'http://localhost:3000'

$(document).ready(function() {
  getUsers();

  // $('#search-button').on('click', function() {
  //   let searchValue = $('#search-input').val();
  //   performSearch(searchValue);
  // });

  // $('#create-user-button').on('click', function() {
  //   let name = prompt('Enter user name:');
  //   let surname = prompt('Enter user surname:');
  //   let country = prompt('Enter user country:');
  //   let email = prompt('Enter user email:');
  //
  //   let newUser = {
  //     name: name,
  //     surname: surname,
  //     country: country,
  //     email: email
  //   };
  //
  //   createUser(newUser);
  // });

  function getUsers() {
    $.ajax({
      url: `${defaultUrl}/users`,
      method: 'GET',
      success: function(response) {
        let tbody = $('#user-table tbody');

        tbody.empty();

        response.forEach(function(user) {
          let row = $('<tr>');
          row.append('<td>' + user.id + '</td>');
          row.append('<td>' + user.name + '</td>');
          row.append('<td>' + user.surname + '</td>');
          row.append('<td>' + user.email + '</td>');

          $.ajax({
            url: `${defaultUrl}/users/country`,
            method: 'GET',
            success: function(country) {
              console.log(country);
            }
          });

          row.attr('data-id', user.id);

          tbody.append(row);
        });
      },
      error: function(error) {
        console.log('Error getting users:', error);
      }
    });
  }

  // function getUsers() {
  //   $.ajax({
  //     url: `${defaultUrl}/users`,
  //     method: 'GET',
  //     success: function(response) {
  //       let tbody = $('#user-table tbody');
  //
  //       tbody.empty();
  //
  //       response.forEach(function(user) {
  //         let row = $('<tr>');
  //         row.append('<td>' + user.id + '</td>');
  //         row.append('<td>' + user.name + '</td>');
  //         row.append('<td>' + user.surname + '</td>');
  //         row.append('<td>' + user.email + '</td>');
  //
  //         $.ajax({
  //           url: `${defaultUrl}/users/country`,
  //           method: 'GET',
  //           success: function(country) {
  //             console.log(country);
  //           }
  //         })
  //
  //
  //
  //         row.attr('data-id', user.id);
  //
  //         let actions = $('<td>');
  //         let updateButton = $('<button>').text('Update');
  //         let deleteButton = $('<button>').text('Delete');
  //
  //         updateButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //
  //           let userId = row.find('td:nth-child(1)').text();
  //           let currentName = row.find('td:nth-child(2)').text();
  //           let currentSurname = row.find('td:nth-child(3)').text();
  //           let currentCountry = row.find('td:nth-child(4)').text();
  //           let currentEmail = row.find('td:nth-child(6)').text();
  //
  //           let updatedName = prompt('Input your name:');
  //           let updatedSurname = prompt('Input your surname:');
  //           let updatedEmail = prompt('Input your email:');
  //
  //           if (!updatedName) { updatedName = currentName;}
  //           if (!updatedSurname) { updatedSurname = currentSurname; }
  //           if (!updatedEmail) { updatedEmail = currentEmail; }
  //
  //           let updatedUser = {
  //             name: updatedName,
  //             surname: updatedSurname,
  //             country: currentCountry,
  //             email: updatedEmail
  //           };
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'PUT',
  //             data: updatedUser,
  //             success: function(response) {
  //               console.log('User updated:', response);
  //               row.find('td:nth-child(2)').text(updatedName);
  //               row.find('td:nth-child(3)').text(updatedSurname);
  //               row.find('td:nth-child(6)').text(updatedEmail);
  //             },
  //             error: function(error) {
  //               console.log('Error updating user:', error);
  //             }
  //           });
  //         });
  //
  //         deleteButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //           let userId = row.find('td:nth-child(1)').text();
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'DELETE',
  //             success: function(response) {
  //               console.log('User deleted:', response);
  //               row.remove();
  //             },
  //             error: function(error) {
  //               console.log('Error deleting user:', error);
  //             }
  //           });
  //         });
  //         actions.append(updateButton);
  //         actions.append(deleteButton);
  //         row.append(actions);
  //
  //         tbody.append(row);
  //       });
  //     },
  //     error: function(error) {
  //       console.log('Error getting users:', error);
  //     }
  //   });
  // }

  // function performSearch(searchValue) {
  //   $.ajax({
  //     url: `${defaultUrl}/users`,
  //     method: 'GET',
  //     data: { search: searchValue },
  //     success: function(response) {
  //       let tbody = $('#user-table tbody');
  //       tbody.empty();
  //
  //       response.forEach(function(user) {
  //         let row = $('<tr>');
  //         row.append('<td>' + user.id + '</td>');
  //         row.append('<td>' + user.name + '</td>');
  //         row.append('<td>' + user.surname + '</td>');
  //
  //         row.append('<td>' + user.email + '</td>');
  //
  //         row.attr('data-id', user.id);
  //
  //         let actions = $('<td>');
  //         let updateButton = $('<button>').text('Update');
  //         let deleteButton = $('<button>').text('Delete');
  //
  //         updateButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //
  //           let userId = row.find('td:nth-child(1)').text();
  //           let currentName = row.find('td:nth-child(2)').text();
  //           let currentSurname = row.find('td:nth-child(3)').text();
  //           let currentCountry = row.find('td:nth-child(4)').text();
  //           let currentEmail = row.find('td:nth-child(6)').text();
  //
  //           let updatedName = prompt('Input your name:');
  //           let updatedSurname = prompt('Input your surname:');
  //           let updatedEmail = prompt('Input your email:');
  //
  //           if (!updatedName) {
  //             updatedName = currentName;
  //           }
  //           if (!updatedSurname) {
  //             updatedSurname = currentSurname;
  //           }
  //           if (!updatedEmail) {
  //             updatedEmail = currentEmail;
  //           }
  //
  //           let updatedUser = {
  //             name: updatedName,
  //             surname: updatedSurname,
  //             country: currentCountry,
  //             email: updatedEmail
  //           };
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'PUT',
  //             data: updatedUser,
  //             success: function(response) {
  //               console.log('User updated:', response);
  //               row.find('td:nth-child(2)').text(updatedName);
  //               row.find('td:nth-child(3)').text(updatedSurname);
  //               row.find('td:nth-child(6)').text(updatedEmail);
  //             },
  //             error: function(error) {
  //               console.log('Error updating user:', error);
  //             }
  //           });
  //         });
  //
  //         deleteButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //           let userId = row.find('td:nth-child(1)').text();
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'DELETE',
  //             success: function(response) {
  //               console.log('User deleted:', response);
  //               row.remove();
  //             },
  //             error: function(error) {
  //               console.log('Error deleting user:', error);
  //             }
  //           });
  //         });
  //
  //         actions.append(updateButton);
  //         actions.append(deleteButton);
  //         row.append(actions);
  //
  //         tbody.append(row);
  //       });
  //
  //       $('.update-button').on('click', function() {
  //         let row = $(this).closest('tr');
  //         let userId = row.find('td:nth-child(1)').text();
  //
  //         let updatedName = prompt('Input your name:');
  //         let updatedSurname = prompt('Input your surname:');
  //         let updatedEmail = prompt('Input your email:');
  //
  //         updateUser(userId, updatedName, updatedSurname, updatedEmail);
  //
  //         row.find('td:nth-child(2)').text(updatedName);
  //         row.find('td:nth-child(3)').text(updatedSurname);
  //         row.find('td:nth-child(6)').text(updatedEmail);
  //       });
  //
  //       $('.delete-button').on('click', function() {
  //         let row = $(this).closest('tr');
  //         let userId = row.find('td:nth-child(1)').text();
  //
  //         deleteUser(userId);
  //         row.remove();
  //       });
  //     },
  //     error: function(error) {
  //       console.log('Ошибка при поиске пользователей:', error);
  //     }
  //   });
  // }

  // function createUser(user) {
  //   $.ajax({
  //     url: `${defaultUrl}/users`,
  //     method: 'POST',
  //     data: user,
  //     success: function(response) {
  //       console.log('User created:', response);
  //     },
  //     error: function(error) {
  //       console.log('Error creating user:', error);
  //     }
  //   });
  // }

  // function updateUser(id, updatedName, updatedSurname, updatedEmail) {
  //   let updatedUser = {
  //     name: updatedName || '',
  //     surname: updatedSurname || '',
  //     email: updatedEmail || ''
  //   };
  //
  //   $.ajax({
  //     url: `${defaultUrl}/users/${id}`,
  //     method: 'PUT',
  //     data: updatedUser,
  //     success: function(response) {
  //       console.log('User updated successfully:', response);
  //     },
  //     error: function(error) {
  //       console.log('Error at updating the user:', error);
  //     }
  //   });
  // }

  // async function deleteUser(id) {
  //   await $.ajax({
  //     url: `${defaultUrl}/users/${id}`,
  //     method: 'DELETE',
  //     success: function(response) {
  //       console.log('User deleted:', response);
  //     },
  //     error: function(error) {
  //       console.log('Error at deleting the user:', error);
  //     }
  //   });
  // }

  // $('.search-input').on('keyup', function() {
  //   let searchValue = $(this).val();
  //
  //   $.ajax({
  //     url: `${defaultUrl}/users`,
  //     method: 'GET',
  //     data: { search: searchValue },
  //     success: function(response) {
  //       var tbody = $('#user-table tbody');
  //       tbody.empty();
  //
  //       response.forEach(function(user) {
  //         let row = $('<tr>');
  //         row.append('<td>' + user.id + '</td>');
  //         row.append('<td>' + user.name + '</td>');
  //         row.append('<td>' + user.surname + '</td>');
  //
  //         row.append('<td>' + user.email + '</td>');
  //
  //         row.attr('data-id', user.id);
  //
  //         let actions = $('<td>');
  //         let updateButton = $('<button>').text('Update');
  //         let deleteButton = $('<button>').text('Delete');
  //
  //         updateButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //
  //           let userId = row.find('td:nth-child(1)').text();
  //           let currentName = row.find('td:nth-child(2)').text();
  //           let currentSurname = row.find('td:nth-child(3)').text();
  //           let currentCountry = row.find('td:nth-child(4)').text();
  //           let currentEmail = row.find('td:nth-child(6)').text();
  //
  //           let updatedName = prompt('Input your name:');
  //           let updatedSurname = prompt('Input your surname:');
  //           let updatedEmail = prompt('Input your email:');
  //
  //           if (!updatedName) {
  //             updatedName = currentName;
  //           }
  //           if (!updatedSurname) {
  //             updatedSurname = currentSurname;
  //           }
  //           if (!updatedEmail) {
  //             updatedEmail = currentEmail;
  //           }
  //
  //           let updatedUser = {
  //             name: updatedName,
  //             surname: updatedSurname,
  //             country: currentCountry,
  //             email: updatedEmail
  //           };
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'PUT',
  //             data: updatedUser,
  //             success: function(response) {
  //               console.log('User updated:', response);
  //               row.find('td:nth-child(2)').text(updatedName);
  //               row.find('td:nth-child(3)').text(updatedSurname);
  //               row.find('td:nth-child(6)').text(updatedEmail);
  //             },
  //             error: function(error) {
  //               console.log('Error updating user:', error);
  //             }
  //           });
  //         });
  //
  //         deleteButton.on('click', function() {
  //           let row = $(this).closest('tr');
  //           let userId = row.find('td:nth-child(1)').text();
  //
  //           $.ajax({
  //             url: `${defaultUrl}/users/${userId}`,
  //             method: 'DELETE',
  //             success: function(response) {
  //               console.log('User deleted:', response);
  //               row.remove();
  //             },
  //             error: function(error) {
  //               console.log('Error deleting user:', error);
  //             }
  //           });
  //         });
  //
  //         actions.append(updateButton);
  //         actions.append(deleteButton);
  //         row.append(actions);
  //
  //         tbody.append(row);
  //       });
  //     },
  //     error: function(error) {
  //       console.log('Error at searching the user:', error);
  //     }
  //   });
  // });
});