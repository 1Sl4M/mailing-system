const defaultUrl = 'http://localhost:3000';

$(document).ready(function() {
  function loadGroups() {
    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupsTable tbody').empty();

      $('#searchForm').submit(function(event) {
        event.preventDefault();

        let searchQuery = $('#searchForm input[name="search"]').val();

        searchGroups(searchQuery);
      });

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

    loadExistingUsers(function(users) {
      displayExistingUsers(users);
    });

    $('#addUserSubmitBtn').click(function() {
      let selectedUserId = $('#existingUserSelect').val();

      $.post(`${defaultUrl}/groups/${groupId}/users/${selectedUserId}`, function() {
        $('#addUserModal').modal('hide');
        updateGroup(groupId);
        loadGroups();
      });
    });
  });

  function loadExistingUsers(callback) {
    $.get(`${defaultUrl}/users`, function(users) {
      callback(users);
    });
  }

  function displayExistingUsers(users) {
    let selectOptions = users.map(user => `<option value="${user.id}">${user.name} (${user.email})</option>`).join('');
    $('#existingUserSelect').html(selectOptions);
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

  $('#addUserForm').submit(function(event) {
    let groupId = $('#addUserForm input[name="groupId"]').val();
    let userId = $('#addUserForm input[name="userId"]').val();
    let userName = $('#addUserForm input[name="userName"]').val();
    let userEmail = $('#addUserForm input[name="userEmail"]').val();

    $.post(`${defaultUrl}/groups/${groupId}/users`, { id: userId, name: userName, email: userEmail }, function() {
      $('#addUserModal').modal('hide');
    });
  });

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
  });

  function updateGroupsTable() {
    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupsTable tbody').empty();

      groups.forEach(function(group) {
        let usersList = group.users.map(user => `<li>${user.id}: ${user.name} (${user.email})</li>`).join('');

        let row = `<tr>
                    <td>${group.id}</td>
                    <td>${group.title}</td>
                    <td>${group.description}</td>
                    <td>
                      <ul>${usersList}</ul>
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

  // ... остальной код обработчиков событий и функций ...
});