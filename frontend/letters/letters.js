const defaultUrl = 'http://localhost:3000';

$(document).ready(function() {
  let selectedGroupId;

  $('#create-letter-btn').click(function() {
    $('#addGroupModal').show();
    loadGroups();
  });

  $('#closeGroupModal').click(function() {
    $('#addGroupModal').hide();
  });

  function loadGroups() {
    let selectedGroup;

    $.get(`${defaultUrl}/groups`, function(groups) {
      $('#groupList').hide();

      $('#groupSearch').off().on('input', function() {
        let query = $(this).val().toLowerCase();
        let filteredGroups = groups.filter(group => group.id.toString().includes(query) || group.title.toLowerCase().includes(query) || group.description.toLowerCase().includes(query));

        if (filteredGroups.length > 0 && query !== '') {
          $('#groupList').show();
          displayGroups(filteredGroups);
        } else {
          $('#groupList').hide();
        }
      });
    });

    function displayGroups(groups) {
      let groupList = $('#groupList');
      groupList.empty();

      groups.forEach(group => {
        let listItem = $('<li>')
          .addClass('group-item')
          .data('group-id', group.id)
          .append($('<input>').attr('type', 'radio').attr('name', 'groupSelection').attr('value', group.id))
          .append(`${group.id}: ${group.title} (${group.description})`);
        groupList.append(listItem);
      });

      $('input[name="groupSelection"]').change(function() {
        selectedGroupId = $(this).val();
        console.log(selectedGroupId);
      });
    }
  }

  $('#addGroupModalBtn').click(function() {
    if ($('input[name="groupSelection"]:checked').length > 0) {
      $('#addGroupModal').hide();
      $('#create-letter-modal').show();
    } else {
      alert('Please select a group before creating a letter.');
    }
  });

  $('#create-letter-form').submit(function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    let theme = $('#theme').val();
    let content = $('#content').val();

    createLetter(selectedGroupId, theme, content);
  });

  $('.close').click(function() {
    $('#create-letter-modal').hide();
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

                switch (status_code) {
                  case 'SUCCESS':
                    row.append('<td class="success">' + status_code + '</td>');
                    break;
                  case 'FAIL':
                    row.append('<td class="fail">' + status_code + '</td>');
                    break;
                  case 'PARTIAL':
                    row.append('<td class="partial">' + status_code + '</td>');
                    break;
                  default:
                    row.append('<td>' + (status_code ? status_code : '') + '</td>');
                }

                row.append('<td>' + letter.content + '</td>');
                row.append('<td>' + (letter.created_at ? letter.created_at : '') + '</td>');

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
                      url: `${defaultUrl}/users/statusCode/${item.group_id}/letters/${letter.id}`,
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

  function createLetter(groupId, theme, content) {
    $.ajax({
      url: `${defaultUrl}/letters`,
      type: 'POST',
      data: {
        groupId: groupId,
        theme: theme,
        content: content
      },
      success: function(letter) {
        $.ajax({
          url: `${defaultUrl}/letters/send-email/${letter.id}/${groupId}`,
          type: 'GET',
          success: function() {
            alert('Message sent successfully');
          }
        })
      }
    });
  }
});