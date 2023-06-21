const defaultUrl = 'http://localhost:3000';

function loadSpam() {
  $.ajax({
    url: `${defaultUrl}/letters/spam`,
    type: 'GET',
    success: function(spam) {
      spam.forEach(function(item) {
        $.ajax({
          url: `${defaultUrl}/letters/${item.letter_id}`,
          type: 'GET',
          success: function(letters) {
            letters.forEach(function(letter) {
              let row = $('<tr></tr>');
              row.append('<td>' + letter.id + '</td>');
              row.append('<td>' + letter.theme + '</td>');
              row.append('<td>' + letter.content + '</td>');

              $.ajax({
                url: `${defaultUrl}/groups/${item.group_id}`,
                type: 'GET',
                success: function(groups) {
                  let groupCell = $('<td></td>');
                  groups.forEach(function(group) {
                    let groupInfo = 'ID: ' + group.id + '<br>Title: ' + group.title + '<br>Description: ' + group.description;
                    groupCell.append(groupInfo + '<br><br>'); // Добавляем информацию о группе с использованием тега <br> для разделения строк
                  });

                  row.append(groupCell);
                  row.append('<td></td>'); // Создаем пустую ячейку для столбца "Users"
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
