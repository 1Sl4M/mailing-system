const defaultUrl = 'http://localhost:3000'

$(document).ready(function() {
  getUsers();

  $('#search-button').on('click', function() {
    let searchValue = $('#search-input').val();
    performSearch(searchValue);
  });

  $('#create-user-button').on('click', function() {
    let name = prompt('Enter user name:');
    let surname = prompt('Enter user surname:');
    let country = prompt('Enter user country:');
    let city = prompt('Enter user city:');
    let email = prompt('Enter user email:');

    let newUser = {
      name: name,
      surname: surname,
      country: country,
      city: city,
      email: email
    };

    createUser(newUser);
  });

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

          let countrySelect = $('<select>').addClass('country-select');
          let countries = response.map(user => user.country).filter((value, index, self) => self.indexOf(value) === index);

          countries.forEach(function(country) {
            let option = $('<option>').text(country).val(country);
            if (country === user.country) {
              option.prop('selected', true);
            }
            countrySelect.append(option);
          });

          row.append($('<td>').append(countrySelect));

          let citySelect = $('<select>').addClass('city-select');
          let cities = response.filter(user => user.country === user.country).map(user => user.city);

          cities.forEach(function(city) {
            let option = $('<option>').text(city).val(city);
            if (city === user.city) {
              option.prop('selected', true);
            }
            citySelect.append(option);
          });

          row.append($('<td>').append(citySelect));
          row.append('<td>' + user.email + '</td>');

          row.attr('data-id', user.id);

          let actions = $('<td>');
          let updateButton = $('<button>').text('Update');
          let deleteButton = $('<button>').text('Delete');

          updateButton.on('click', function() {
            let row = $(this).closest('tr');

            let userId = row.find('td:nth-child(1)').text();
            let currentName = row.find('td:nth-child(2)').text();
            let currentSurname = row.find('td:nth-child(3)').text();
            let currentCountry = row.find('td:nth-child(4)').text();
            let currentEmail = row.find('td:nth-child(6)').text();

            let updatedName = prompt('Input your name:');
            let updatedSurname = prompt('Input your surname:');
            let updatedEmail = prompt('Input your email:');

            if (!updatedName) { updatedName = currentName;}
            if (!updatedSurname) { updatedSurname = currentSurname; }
            if (!updatedEmail) { updatedEmail = currentEmail; }

            let updatedUser = {
              name: updatedName,
              surname: updatedSurname,
              country: currentCountry,
              email: updatedEmail
            };

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'PUT',
              data: updatedUser,
              success: function(response) {
                console.log('User updated:', response);
                row.find('td:nth-child(2)').text(updatedName);
                row.find('td:nth-child(3)').text(updatedSurname);
                row.find('td:nth-child(6)').text(updatedEmail);
              },
              error: function(error) {
                console.log('Error updating user:', error);
              }
            });
          });

          deleteButton.on('click', function() {
            let row = $(this).closest('tr');
            let userId = row.find('td:nth-child(1)').text();

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'DELETE',
              success: function(response) {
                console.log('User deleted:', response);
                row.remove();
              },
              error: function(error) {
                console.log('Error deleting user:', error);
              }
            });
          });
          actions.append(updateButton);
          actions.append(deleteButton);
          row.append(actions);

          tbody.append(row);
        });

        $('.country-select').change(function() {
          let country = $(this).val();
          let id = $(this).closest('tr').data('id');
          let citySelect = $(this).closest('tr').find('.city-select');

          $.ajax({
            url: `${defaultUrl}/users/${country}/${id}`,
            method: 'PUT',
            data: { country: country },
            success: function(data) {
              let cities = response.filter(user => user.country === country).map(user => user.city);
              citySelect.empty();

              cities.forEach(function(city) {
                let option = $('<option>').text(city).val(city);
                citySelect.append(option);
              });

              alert('User updated');
            },
            error: function(error) {
              console.log('Error updating user:', error);
            }
          });
        });

      },
      error: function(error) {
        console.log('Error getting users:', error);
      }
    });
  }

  function performSearch(searchValue) {
    $.ajax({
      url: `${defaultUrl}/users`,
      method: 'GET',
      data: { search: searchValue },
      success: function(response) {
        let tbody = $('#user-table tbody');
        tbody.empty();

        response.forEach(function(user) {
          let row = $('<tr>');
          row.append('<td>' + user.id + '</td>');
          row.append('<td>' + user.name + '</td>');
          row.append('<td>' + user.surname + '</td>');
          row.append('<td>' + user.country + '</td>');
          row.append('<td>' + user.city + '</td>');

          let citySelect = $('<select>').addClass('city-select');
          let cities = ["Astana", "Shymkent", "Almata", "Taraz", "Aktobe", "Atyrau", "Kostanai"];

          cities.forEach(function(city) {
            let option = $('<option>').text(city).val(city);
            if (city === user.city) {
              option.prop('selected', true);
            }
            citySelect.append(option);
          });

          row.append($('<td>').append(citySelect));
          row.append('<td>' + user.email + '</td>');

          row.attr('data-id', user.id);

          let actions = $('<td>');
          let updateButton = $('<button>').text('Update');
          let deleteButton = $('<button>').text('Delete');

          updateButton.on('click', function() {
            let row = $(this).closest('tr');

            let userId = row.find('td:nth-child(1)').text();
            let currentName = row.find('td:nth-child(2)').text();
            let currentSurname = row.find('td:nth-child(3)').text();
            let currentCountry = row.find('td:nth-child(4)').text();
            let currentEmail = row.find('td:nth-child(6)').text();

            let updatedName = prompt('Input your name:');
            let updatedSurname = prompt('Input your surname:');
            let updatedEmail = prompt('Input your email:');

            if (!updatedName) {
              updatedName = currentName;
            }
            if (!updatedSurname) {
              updatedSurname = currentSurname;
            }
            if (!updatedEmail) {
              updatedEmail = currentEmail;
            }

            let updatedUser = {
              name: updatedName,
              surname: updatedSurname,
              country: currentCountry,
              email: updatedEmail
            };

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'PUT',
              data: updatedUser,
              success: function(response) {
                console.log('User updated:', response);
                row.find('td:nth-child(2)').text(updatedName);
                row.find('td:nth-child(3)').text(updatedSurname);
                row.find('td:nth-child(6)').text(updatedEmail);
              },
              error: function(error) {
                console.log('Error updating user:', error);
              }
            });
          });

          deleteButton.on('click', function() {
            let row = $(this).closest('tr');
            let userId = row.find('td:nth-child(1)').text();

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'DELETE',
              success: function(response) {
                console.log('User deleted:', response);
                row.remove();
              },
              error: function(error) {
                console.log('Error deleting user:', error);
              }
            });
          });

          actions.append(updateButton);
          actions.append(deleteButton);
          row.append(actions);

          tbody.append(row);
        });

        $('.city-select').change(function() {
          let city = $(this).val();
          let id = $(this).closest('tr').data('id');

          $.ajax({
            url: `${defaultUrl}/users/${id}`,
            method: 'PUT',
            data: { city: city },
            success: function(data) {
              alert('User updated');
            },
            error: function(error) {
              console.log('Error updating user:', error);
            }
          });
        });

        $('.update-button').on('click', function() {
          let row = $(this).closest('tr');
          let userId = row.find('td:nth-child(1)').text();

          let updatedName = prompt('Input your name:');
          let updatedSurname = prompt('Input your surname:');
          let updatedEmail = prompt('Input your email:');

          updateUser(userId, updatedName, updatedSurname, updatedEmail);

          row.find('td:nth-child(2)').text(updatedName);
          row.find('td:nth-child(3)').text(updatedSurname);
          row.find('td:nth-child(6)').text(updatedEmail);
        });

        $('.delete-button').on('click', function() {
          let row = $(this).closest('tr');
          let userId = row.find('td:nth-child(1)').text();

          deleteUser(userId);
          row.remove();
        });
      },
      error: function(error) {
        console.log('Ошибка при поиске пользователей:', error);
      }
    });
  }

  function createUser(user) {
    $.ajax({
      url: `${defaultUrl}/users`,
      method: 'POST',
      data: user,
      success: function(response) {
        console.log('User created:', response);
      },
      error: function(error) {
        console.log('Error creating user:', error);
      }
    });
  }

  function updateUser(id, updatedName, updatedSurname, updatedEmail) {
    let updatedUser = {
      name: updatedName || '',
      surname: updatedSurname || '',
      email: updatedEmail || ''
    };

    $.ajax({
      url: `${defaultUrl}/users/${id}`,
      method: 'PUT',
      data: updatedUser,
      success: function(response) {
        console.log('User updated successfully:', response);
      },
      error: function(error) {
        console.log('Error at updating the user:', error);
      }
    });
  }

  async function deleteUser(id) {
    await $.ajax({
      url: `${defaultUrl}/users/${id}`,
      method: 'DELETE',
      success: function(response) {
        console.log('User deleted:', response);
      },
      error: function(error) {
        console.log('Error at deleting the user:', error);
      }
    });
  }

  $('.search-input').on('keyup', function() {
    let searchValue = $(this).val();

    $.ajax({
      url: `${defaultUrl}/users`,
      method: 'GET',
      data: { search: searchValue },
      success: function(response) {
        var tbody = $('#user-table tbody');
        tbody.empty();

        response.forEach(function(user) {
          let row = $('<tr>');
          row.append('<td>' + user.id + '</td>');
          row.append('<td>' + user.name + '</td>');
          row.append('<td>' + user.surname + '</td>');
          row.append('<td>' + user.country + '</td>');

          let citySelect = $('<select>').addClass('city-select');
          let cities = ["Astana", "Shymkent", "Almata", "Taraz", "Aktobe", "Atyrau", "Kostanai"];

          cities.forEach(function(city) {
            let option = $('<option>').text(city).val(city);
            if (city === user.city) {
              option.prop('selected', true);
            }
            citySelect.append(option);
          });

          row.append($('<td>').append(citySelect));
          row.append('<td>' + user.email + '</td>');

          row.attr('data-id', user.id);

          let actions = $('<td>');
          let updateButton = $('<button>').text('Update');
          let deleteButton = $('<button>').text('Delete');

          updateButton.on('click', function() {
            let row = $(this).closest('tr');

            let userId = row.find('td:nth-child(1)').text();
            let currentName = row.find('td:nth-child(2)').text();
            let currentSurname = row.find('td:nth-child(3)').text();
            let currentCountry = row.find('td:nth-child(4)').text();
            let currentCity = row.find('.city-select').val();
            let currentEmail = row.find('td:nth-child(6)').text();

            let updatedName = prompt('Input your name:');
            let updatedSurname = prompt('Input your surname:');
            let updatedEmail = prompt('Input your email:');

            if (!updatedName) {
              updatedName = currentName;
            }
            if (!updatedSurname) {
              updatedSurname = currentSurname;
            }
            if (!updatedEmail) {
              updatedEmail = currentEmail;
            }

            let updatedUser = {
              name: updatedName,
              surname: updatedSurname,
              country: currentCountry,
              email: updatedEmail
            };

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'PUT',
              data: updatedUser,
              success: function(response) {
                console.log('User updated:', response);
                row.find('td:nth-child(2)').text(updatedName);
                row.find('td:nth-child(3)').text(updatedSurname);
                row.find('td:nth-child(6)').text(updatedEmail);
              },
              error: function(error) {
                console.log('Error updating user:', error);
              }
            });
          });

          deleteButton.on('click', function() {
            let row = $(this).closest('tr');
            let userId = row.find('td:nth-child(1)').text();

            $.ajax({
              url: `${defaultUrl}/users/${userId}`,
              method: 'DELETE',
              success: function(response) {
                console.log('User deleted:', response);
                row.remove();
              },
              error: function(error) {
                console.log('Error deleting user:', error);
              }
            });
          });

          actions.append(updateButton);
          actions.append(deleteButton);
          row.append(actions);

          tbody.append(row);
        });
        tbody.on('change', '.city-select', function() {
          let city = $(this).val();
          let id = $(this).closest('tr').data('id');

          $.ajax({
            url: `${defaultUrl}/users/${city}/${id}`,
            method: 'PUT',
            data: { city: city },
            success: function(data) {
              alert('User updated');
            },
            error: function(error) {
              console.log('Error updating user:', error);
            }
          });
        });
      },
      error: function(error) {
        console.log('Error at searching the user:', error);
      }
    });
  });
});