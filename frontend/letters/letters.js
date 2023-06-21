const defaultUrl = 'http://localhost:3000';

function loadLetter(letterId) {
  $.ajax({
    url: `${defaultUrl}/letters/${letterId}`,
    type: 'GET',
    dataType: 'json',
    success: function(letter) {
      $('#lettersTable tbody').empty();

      let row = $('<tr></tr>');
      row.append('<td>' + letter.id + '</td>');
      row.append('<td>' + letter.theme + '</td>');
      row.append('<td>' + letter.content + '</td>');
      $('#lettersTable tbody').append(row);
    },
    error: function(xhr, status, error) {
      console.error(error);
    }
  });
}

// Пример вызова функции для получения письма с идентификатором 1
loadLetter(1);

function getGroupsString(group) {
  let groups = group.map(function(item) {
    return item.group.title;
  });
  return groups.join(', ');
}

function getUsersString(sentUsers) {
  let users = sentUsers.map(function(item) {
    return item.users.name + ' ' + item.users.surname;
  });
  return users.join(', ');
}
