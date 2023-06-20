const defaultUrl = 'http://localhost:3000';

$(document).ready(function() {
  function loadGroups() {
    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupsTable tbody').empty();

      groups.forEach(function(group) {
        let usersString = group.users.map(user => `${user.id}: ${user.name} (${user.email})`).join(', ');

        let row = `<tr>
                    <td>${group.id}</td>
                    <td>${group.title}</td>
                    <td>${group.description}</td>
                    <td>${usersString}</td>
                    <td>
                      <button class="deleteGroupBtn" data-group-id="${group.id}">Delete</button>
                    </td>
                    <td>
                      <button class="editGroupBtn" data-group-id="${group.id}">Редактировать</button>
                    </td>
                 </tr>`;

        $('#groupsTable tbody').append(row);
      });
    });
  }


  loadGroups();

  $(document).on('click', '.deleteUserBtn', function() {
    // ... ваш код удаления пользователя из группы ...
  });

  $('#addUserForm').submit(function(event) {
    event.preventDefault();

    var groupId = $('#addUserForm input[name="groupId"]').val();
    var userId = $('#addUserForm input[name="userId"]').val();

    // Отправляем запрос на добавление пользователя в группу
    $.post(`${defaultUrl}/groups/${groupId}/users/${userId}`, function() {
      // Обновляем содержимое таблицы после добавления пользователя в группу
      updateGroupsTable();
    });
  });

// Функция обновления содержимого таблицы групп
  function updateGroupsTable() {
    $.patch(`${defaultUrl}/groups`, function(groups) {
      $('#groupsTable tbody').empty();

      groups.forEach(function(group) {
        let row = `<tr data-group-id="${group.id}">
                    <td>${group.id}</td>
                    <td>${group.title}</td>
                    <td>${group.description}</td>
                    <td>${group.users}</td>
                    <td>
                      <button class="deleteGroupBtn" data-group-id="${group.id}">Delete</button>
                    </td>
                    <td>
                      <button class="editGroupBtn" data-group-id="${group.id}">Редактировать</button>
                    </td>
                 </tr>`;

        $('#groupsTable tbody').append(row);
      });
    });
  }

  // ... остальной код обработчиков событий и функций ...
});
