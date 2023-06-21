const defaultUrl = 'http://localhost:3000';

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
                    url: `${defaultUrl}/groups/users/${item.group_id}`,
                    type: 'GET',
                    success: function(users) {
                      let usersCell = $('<td></td>');
                      let usersList = $('<ul></ul>');

                      users.forEach(function(user) {
                        let userItem = $('<li></li>');
                        userItem.append('ID: ' + user.id + '<br>');
                        userItem.append('Name: ' + user.name + '<br>');
                        userItem.append('Email: ' + user.email + '<br><br>');

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
