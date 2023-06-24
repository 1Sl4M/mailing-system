const defaultUrl = 'http://localhost:3000'

$(document).ready(function() {
  getUsers();

  $('#search-button').on('click', function() {
    let searchValue = $('#search-input').val();
    performSearch(searchValue);
  });

  $('#create-user').on('click', function() {
    getCountriesCreate();

    $('#create-user-modal').css('display', 'block');
  });

  $('#create-user-form').on('submit', function(event) {
    event.preventDefault();

    let newUser = {
      name: $('#name-create').val(),
      surname: $('#surname-create').val(),
      email: $('#email-create').val(),
      country_id: $('#country-create').val(),
      city: $('#city-create').val()
    };

    createUser(newUser);
  });


  function getUsers() {
    $.ajax({
      url: `${defaultUrl}/users/filter`,
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
          row.append('<td>' + user.country_name + '</td>');
          row.append('<td>' + user.city + '</td>');

          let actions = $('<td>');
          let deleteButton = $('<button>').text('Delete');
          let updateButton = $('<button>').text('Update user').addClass('update-button');

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

          actions.append(deleteButton);
          actions.append(updateButton);

          row.append(actions);

          tbody.append(row);

          row.attr('data-id', user.id);
        });
      },
      error: function(error) {
        console.log('Error getting users:', error);
      }
    });
  }

  function getCountriesCreate() {
    $.ajax({
      url: `${defaultUrl}/country`,
      method: 'GET',
      success: function(response) {
        const countrySelect = $('#country-create');

        countrySelect.empty();
        countrySelect.append($('<option>').val('').text('Select Country'));

        response.forEach(function(country) {
          countrySelect.append($('<option>').val(country.country_id).text(country.country_name));
        });
      },
      error: function(error) {
        console.log('Error getting countries:', error);
      }
    });
  }

  function getCitiesCreate(countryId) {
    $.ajax({
      url: `${defaultUrl}/city/${countryId}`,
      method: 'GET',
      success: function(response) {
        const citySelect = $('#city-create');

        citySelect.empty();
        citySelect.append($('<option>').val('').text('Select City'));

        response.forEach(function(city) {
          console.log(city);
          citySelect.append($('<option>').val(city.city_name).text(city.city_name));
        });
      },
      error: function(error) {
        console.log('Error getting cities:', error);
      }
    });
  }

  function getCountries() {
    $.ajax({
      url: `${defaultUrl}/country`,
      method: 'GET',
      success: function(response) {
        const countrySelect = $('#country');

        countrySelect.empty();
        countrySelect.append($('<option>').val('').text('Select Country'));

        response.forEach(function(country) {
          countrySelect.append($('<option>').val(country.country_id).text(country.country_name));
        });
      },
      error: function(error) {
        console.log('Error getting countries:', error);
      }
    });
  }

  function getCities(countryId) {
    $.ajax({
      url: `${defaultUrl}/city/${countryId}`,
      method: 'GET',
      success: function(response) {
        const citySelect = $('#city');

        citySelect.empty();
        citySelect.append($('<option>').val('').text('Select City'));

        response.forEach(function(city) {
          console.log(city);
          citySelect.append($('<option>').val(city.city_name).text(city.city_name));
        });
      },
      error: function(error) {
        console.log('Error getting cities:', error);
      }
    });
  }

  $('#country').on('change', function() {
    const countryId = $(this).val();
    getCities(countryId);
  });

  $('#country-create').on('change', function() {
    const countryId = $(this).val();
    getCitiesCreate(countryId);
  });

  $(document).on('click', '.update-button', function() {
    getCountries();

    let row = $(this).closest('tr');
    let userId = row.find('td:nth-child(1)').text();
    let userName = row.find('td:nth-child(2)').text();
    let userSurname = row.find('td:nth-child(3)').text();
    let userEmail = row.find('td:nth-child(4)').text();

    let userCountry = row.find('td:nth-child(6)').text();
    let userCity = row.find('td:nth-child(7)').text();

    $('#name').val(userName);
    $('#surname').val(userSurname);
    $('#email').val(userEmail);

    $('#country').val(userCountry);
    setTimeout(function() {
      $('#city').val(userCity);
    }, 100);

    $('#update-user-modal').css('display', 'block');

    $('#update-user-form').off('submit').on('submit', function(event) {
      event.preventDefault();

      let updatedUser = {
        name: $('#name').val(),
        surname: $('#surname').val(),
        email: $('#email').val(),
        country_id: $('#country').val(),
        city: $('#city').val()
      };

      row.find('td:nth-child(6)').text($('#country option:selected').text());
      row.find('td:nth-child(7)').text($('#city option:selected').text());

      $('#update-user-modal').css('display', 'none');

      $.ajax({
        url: `${defaultUrl}/users/${userId}`,
        method: 'PUT',
        data: updatedUser,
        success: function(response) {
          console.log('User updated:', response);
          $('#update-user-modal').css('display', 'none');
          getUsers();
        },
        error: function(error) {
          console.log('Error updating user:', error);
        }
      });
    });
  });

  $('.close').on('click', function() {
    $('#update-user-modal').css('display', 'none');
  });

  function performSearch(searchValue) {
    $.ajax({
      url: `${defaultUrl}/users/filter`,
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
          row.append('<td>' + user.email + '</td>');

          row.attr('data-id', user.id);

          let actions = $('<td>');
          let deleteButton = $('<button>').text('Delete');
          let updateButton = $('<button>').text('Update user').addClass('update-button');

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

          actions.append(deleteButton);
          actions.append(updateButton);
          row.append(actions);

          tbody.append(row);
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
        alert('User Created successfully');
        location.reload();
      },
      error: function(error) {
        if (error.status === 500) {
          alert('Email is not unique')
        }
      }
    });
  }

  $('.search-input').on('keyup', function() {
    let searchValue = $(this).val();

    $.ajax({
      url: `${defaultUrl}/users/filter`,
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
          row.append('<td>' + user.email + '</td>');
          row.append('<td>' + user.country_name + '</td>');
          row.append('<td>' + user.city_name + '</td>');

          row.attr('data-id', user.id);

          let actions = $('<td>');
          let deleteButton = $('<button>').text('Delete');

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

          actions.append(deleteButton);
          row.append(actions);

          tbody.append(row);
        });
      },
      error: function(error) {
        console.log('Error at searching the user:', error);
      }
    });
  });
});