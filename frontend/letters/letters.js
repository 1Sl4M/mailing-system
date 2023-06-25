const defaultUrl = 'http://localhost:3000';

$(document).ready(function() {
  $('#addGroupModal').hide();

  $('#create-letter-btn').click(function() {
    $('#addGroupModal').show();
    loadGroupsForGroup();
  });

  $('#closeGroupModal').click(function() {
    $('#addGroupModal').hide();
  });

  $(document).on('click', '.addUserBtn', function() {
    $('#groupSearch').val('');
    loadGroupsForGroup();
    $('#addGroupModalBtn').data('group-id', groupId);
  });

  function loadGroupsForGroup() {
    let selectedGroup;

    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupList').hide();

      $('#groupSearch').off().on('input', function() {
        let query = $(this).val().toLowerCase();
        let filteredGroups = groups.filter(group => group.id.toString().includes(query) || group.title.toLowerCase().includes(query) || group.description.toLowerCase().includes(query));

        if (filteredGroups.length > 0 && query !== '') {
          $('#groupList').show(); // Fixed selector to show group list
          displayGroups(filteredGroups);
        } else {
          $('#groupList').hide();
        }
      });

      $('#addGroupModalBtn').off().click(function() {
        // Open create letter modal window
        $('#addGroupModal').hide();
        $('#create-letter-modal').show();
      });

      $('#addGroupsModal').modal('show');
    });

    function displayGroups(groups) {
      let groupList = $('#groupList');
      groupList.empty();

      groups.forEach(group => {
        let listItem = $('<li>')
          .addClass('group-item')
          .data('group-id', group.id)
          .append($('<input>').attr('type', 'checkbox').attr('value', group.id))
          .append(`${group.id}: ${group.title} (${group.description})`);
        groupList.append(listItem);
      });
      $('.group-item').click(function() {
        $('.group-item').removeClass('selected');
        $(this).addClass('selected');

        selectedGroup = $(this).data('group-id');
        console.log(selectedGroup);
      });
    }
  }

  // Event handler for create letter button
  $('#create-letter-btn').click(function() {
    $('#select-group-modal').show();
  });

  function loadSpam() {
    $.ajax({
      url: `${defaultUrl}/letters/spam`,
      type: 'GET',
      success: function(spam) {
        spam.forEach(function(item) {
          let status_code = item.status_code
          $.ajax({
            url: `${defaultUrl}/letters/${item.letter_id}`,
            type: 'GET',
            success: function(letters) {
              letters.forEach(function(letter) {
                let row = $('<tr></tr>');
                row.append('<td>' + letter.id + '</td>');
                row.append('<td>' + letter.theme + '</td>');
                row.append('<td>' + status_code + '</td>');
                row.append('<td>' + letter.content + '</td>');

                $.ajax({
                  url: `${defaultUrl}/groups/${item.group_id}`,
                  type: 'GET',
                  success: function(groups) {
                    let groupCell = $('<td></td>');
                    groups.forEach(function(group) {
                      let groupInfo = 'ID: ' + group.id + '<br>Title: ' + group.title + '<br>Description: ' + group.description;
                      groupCell.append(groupInfo + '<br><br>');
                    });

                    row.append(groupCell);

                    $.ajax({
                      url: `${defaultUrl}/groups/statusCode/${item.group_id}`,
                      type: 'GET',
                      success: function(users) {
                        console.log(item.group_id);
                        let usersCell = $('<td></td>');
                        let usersList = $('<ul></ul>');

                        users.forEach(function(user) {
                          let userItem = $('<li></li>');
                          userItem.append('ID: ' + user.id + '<br>');
                          userItem.append('Name: ' + user.name + '<br>');
                          userItem.append('Email: ' + user.email + '<br>');
                          userItem.append('Status code: ' + user.status_code + '<br><br>');

                          usersList.append(userItem);
                        });

                        usersCell.append(usersList);

                        row.append(usersCell);
                      },
                      error: function(xhr, status, error) {
                        console.error(error);
                      }
                    });

                    $('#lettersTable tbody').append(row);
                  },
                  error: function(xhr, status, error) {
                    console.error(error);
                  }
                });
              });
            },
            error: function(xhr, status, error) {
              console.error(error);
            }
          });
        });
      },
      error: function(xhr, status, error) {
        console.error(error);
      }
    });
  }

  loadSpam();
});