const defaultUrl = 'http://localhost:3000';

$(document).ready(function() {

  function addUserToGroup(groupId, selectedUserId) {
    if (selectedUserId) {
      $.post(`${defaultUrl}/groups/${groupId}/users/${selectedUserId}`, function() {
        updateGroup(groupId);
        $('#addUserModal').modal('hide');
        location.reload();
      }, 'json');
    } else {
      alert('Please select a user to add to the group.');
    }
  }

  function loadGroups() {
    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupsTable tbody').empty();

      groups.forEach(function(group) {
        let usersList = group.users.map(user => `<li>${user.id}: ${user.name} (${user.email}) <button class="deleteUserBtn" data-group-id="${group.id}" data-user-id="${user.id}">Delete User</button></li>`).join('');

        let row = `<tr>
                  <td>${group.id}</td>
                  <td>${group.title}</td>
                  <td>${group.description}</td>
                  <td>
                    <ul>${usersList}</ul>
                  </td>
                  <td>
                    <button class="sendEmailBtn" data-group-id="${group.id}">Send Email</button>
                  </td>
                  <td>
                    <button class="deleteGroupBtn" data-group-id="${group.id}">Delete Group</button>
                  </td>
                  <td>
                    <button class="editGroupBtn" data-group-id="${group.id}">Edit</button>
                  </td>
                  <td>
                    <button class="addUserBtn" data-group-id="${group.id}" data-toggle="modal" data-target="#addUserModal">Add User</button>
                </td>
               </tr>`;

        $('#groupsTable tbody').append(row);
      });
      $(document).on('click', '.editGroupBtn', function() {
        let groupId = $(this).data('group-id');

        let updatedTitle = prompt('Input new title:');
        let updatedDescription = prompt('Input new description:');

        editGroup(groupId, updatedTitle, updatedDescription);
      });
      $(document).on('click', '.createEmailBtn', function() {
        let groupId = $(this).data('group-id');
        $('#saveEmailBtn').data('group-id', groupId);

        $('#createEmailModal').modal('show');
      });

      $('#saveEmailBtn').click(function() {
        let theme = $('#emailTheme').val();
        let content = $('#emailContent').val();

        createEmail(theme, content);
      });
      $(document).on('click', '.sendEmailBtn', function() {
        let groupId = $(this).data('group-id');

        loadEmailsFromDatabase(function(emails) {
          displayEmails(emails);

          $('#sendEmailBtn').off().click(function() {
            let selectedEmailId = $('#emailSelect').val();
            sendEmailToGroup(groupId, selectedEmailId);
          });

          $('#sendEmailModal').modal('show');
        });
      });
    })
  }

  loadGroups();

  $(document).on('click', '.deleteGroupBtn', function() {
    let groupId = $(this).data('group-id');

    $.ajax({
      url: `${defaultUrl}/groups/${groupId}`,
      type: 'DELETE',
      success: function() {
        location.reload();
      }
    });
  });

  $(document).on('click', '.addUserBtn', function() {
    let groupId = $(this).data('group-id');
    $('#userSearch').val('');
    loadUsersForGroup(groupId);
    $('#addUserModalBtn').data('group-id', groupId);
  });

  function loadUsersForGroup(groupId) {
    let selectedUser;

    $.get(`${defaultUrl}/users/filter`, function(users) {
      $('#userList').hide();

      $('#userSearch').off().on('input', function() {
        let query = $(this).val().toLowerCase();
        let filteredUsers = users.filter(user => user.id.toString().includes(query) || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));

        if (filteredUsers.length > 0 && query !== '') {
          $('#userList').show();
          displayUsers(filteredUsers);
        } else {
          $('#userList').hide();
        }
      });
    });

    function displayUsers(users) {
      let userList = $('#userList');
      userList.empty();

      users.forEach(user => {
        let listItem = $('<li>')
          .addClass('user-item')
          .data('user-id', user.id)
          .append($('<input>').attr('type', 'radio').attr('name', 'userSelection').attr('value', user.id))
          .append(`${user.id}: ${user.name} (${user.email})`);
        userList.append(listItem);
      });

      $('input[name="userSelection"]').change(function() {
        let selectedUserId = $(this).val();
        console.log(selectedUserId);
      });
    }
  }

  $('#addUserModalBtn').off().click(function() {
    let selectedUserId = $('input[name="userSelection"]:checked').val();
    if (selectedUserId) {
      let groupId = $(this).data('group-id');
      addUserToGroup(groupId, selectedUserId);
      $('#addUserModal').modal('hide');
    } else {
      alert('Please select a user to add to the group.');
    }
  });

  $('#searchForm').submit(function(event) {
    event.preventDefault();

    let searchQuery = $('#searchForm input[name="search"]').val();

    searchGroups(searchQuery);
  });

  $('.createGroupButton').find('.createGroupButton').click(function() {
    let newTitle = prompt('Input title:');
    let newDescription = prompt('Input description:');

    createGroup(newTitle, newDescription);
  });

  function createGroup(newTitle, newDescription) {
    let newGroup = {
      title: newTitle,
      description: newDescription
    }
    $.ajax({
      url: `${defaultUrl}/groups`,
      type: 'POST',
      data: newGroup,
      success: function() {
        location.reload();
      },
      error: function() {
        console.log('Error creating group');
      }
    })
  }

  function createEmail(theme, content) {
    $.post(`${defaultUrl}/letters`, { theme, content }, function() {
      alert('The letter saved in Db');
      $('#createEmailModal').modal('hide');
    }).fail(function() {
      alert('Failed to create email');
    });
  }

  function loadEmailsFromDatabase(callback) {
    $.get(`${defaultUrl}/letters`, function(letters) {
      callback(letters);
    }).fail(function() {
      alert('Failed to load emails');
    });
  }

  function displayEmails(letters) {
    let selectOptions = letters.map(letter => `<option value="${letter.id}">${letter.id} ${letter.theme} (${letter.content})</option>`).join('');
    $('#emailSelect').html(selectOptions);
  }

  function sendEmailToGroup(groupId, selectedEmailId) {
    if (!selectedEmailId) {
      alert('Please select an email');
      return;
    }

    $.get(`${defaultUrl}/letters/send-email/${selectedEmailId}/${groupId}`)
      .done(function() {
        $('#sendEmailModal').modal('hide');
        alert('Письмо успешно отправлено в группу');
      })
      .fail(function() {
        alert('Failed to send email to group');
      });
  }

  function searchGroups(query) {
    $('#groupsTable tbody').empty();

    $.get(`${defaultUrl}/groups?search=${query}`, function(groups) {
      groups.forEach(function(group) {
        let filteredUsers = group.users.filter(function(user) {
          return user.name.includes(query) ||
            user.email.includes(query) ||
            user.id.toString() === query && user.id !== userId;
        });

        let usersList = filteredUsers.map(function(user) {
          return `<li>${user.id}: ${user.name} (${user.email})</li>`;
        }).join('');

        let row = `<tr>
                  <td>${group.id}</td>
                  <td>${group.title}</td>
                  <td>${group.description}</td>
                  <td>
                    <ul>${usersList}</ul>
                  </td>
                  <td>
                    <button class="sendEmailBtn" data-group-id="${group.id}">Send Email</button>
                  </td>
                  <td>
                    <button class="deleteGroupBtn" data-group-id="${group.id}">Delete Group</button>
                  </td>
                  <td>
                    <button class="editGroupBtn" data-group-id="${group.id}">Edit</button>
                  </td>
                  <td>
                    <button class="addUserBtn" data-group-id="${group.id}" data-toggle="modal" data-target="#addUserModal">Add User</button>
                  </td>
               </tr>`;

        $('#groupsTable tbody').append(row);
      });
    });
  }

  function updateGroup(groupId) {
    $.get(`${defaultUrl}/groups/${groupId}`, function(group) {
      let row = $(`#groupsTable tbody tr[data-group-id="${groupId}"]`);
      let usersList = group.users.map(user => `<li>${user.id}: ${user.name} (${user.email}) <button class="deleteUserBtn" data-group-id="${group.id}" data-user-id="${user.id}">Delete User</button></li>`).join('');

      row.find('td:nth-child(3)').text(group.description);
      row.find('td:nth-child(4) ul').html(usersList);
    });
  }

  function editGroup(groupId, updatedTitle, updatedDescription) {
    let updatedGroup = {
      title: updatedTitle || '',
      description: updatedDescription || ''
    };

    $.ajax({
      url: `${defaultUrl}/groups/${groupId}`,
      type: 'PATCH',
      data: updatedGroup,
      success: function() {
        loadGroups();
      },
      error: function() {
        console.log('Error updating group');
      }
    });
  }

  $(document).on('click', '.deleteUserBtn', function() {
    let groupId = $(this).data('group-id');
    let userId = $(this).data('user-id');

    $.ajax({
      url: `${defaultUrl}/groups/${groupId}/users/${userId}`,
      type: 'DELETE',
      success: function() {
        location.reload();
      }
    });
  })
})