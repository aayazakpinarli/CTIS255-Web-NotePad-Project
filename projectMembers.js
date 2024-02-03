$(document).ready(function () {
  if (JSON.parse(localStorage.getItem("membersDictionaries")) == null) {
    var memberOneDictionary = {};
    var memberTwoDictionary = {};
    var memberThreeDictionary = {};

    var membersDictionaries = {
      1: memberOneDictionary,
      2: memberTwoDictionary,
      3: memberThreeDictionary,
    };
    localStorage.setItem(
      "membersDictionaries",
      JSON.stringify(membersDictionaries)
    );
  }

  var memberId = localStorage.getItem("memberId");
  var membersDictionaries = JSON.parse(
    localStorage.getItem("membersDictionaries")
  );

  $(".to-do-list-content").hide();
  $(".new-task").hide();
  updateSidebarProfile($(".member-container").first());

  function populateSidebarListSection() {
    $(".list-tasks").empty();

    var memberTaskList = membersDictionaries[memberId];
    console.log(memberTaskList);
    if (Object.keys(memberTaskList).length === 0) {
      return;
    }

    Object.keys(memberTaskList).forEach(function (listName) {
      var newList = $('<div class="new-list-item">' + listName + "</div>");

      var deleteIcon = $('<img class="delete-icon" src="images/delete.png" alt="Delete">');
      var uncheckedTaskCount = membersDictionaries[memberId][listName].filter(
        function (task) {
          return !task.isChecked;
        }
      ).length;
      console.log(uncheckedTaskCount);
      var taskCounter = $(
        '<span class="task-counter">' + uncheckedTaskCount + "</span>"
      );

      newList.append(taskCounter);
      newList.append(deleteIcon);

      $(".list-tasks").append(newList);
    });
  }

  $(document).on("click", ".delete-icon", function (event) {
    event.stopPropagation();
    listItem = $(this).parent().text().slice(0, -1);
    console.log(listItem);

    delete membersDictionaries[memberId][listItem];
    localStorage.setItem(
      "membersDictionaries",
      JSON.stringify(membersDictionaries)
    );

    populateSidebarListSection();
    updateToDoListContentPage(listItem);
  });

  function updateToDoListContentPage(currentList ) {
    if (Object.keys(membersDictionaries[memberId]).length == 0) {
      $(".to-do-list-content").hide();
      $(".main-content").show();
    }
    $("#list-container").empty();

    if (membersDictionaries[memberId][currentList] == null){
      var currentList = $(".list-tasks")
      .find(".new-list-item")
      .last()
      .text()
      .slice(0, -1);
    }
   

    $(".content-heading").text(currentList);
    todoTasks = membersDictionaries[memberId][currentList];
    console.log(todoTasks);

    if (todoTasks == null) {
      return;
    }
    for (let i = 0; i < todoTasks.length; i++) {
      $("#list-container").append(
        '<li><input type="checkbox" class="task-checkbox" ' +
          todoTasks[i]["isChecked"] +
          '><span class="task-text">' +
          todoTasks[i]["name"] +
          "</span></li>"
      );
    }
  }

  $(document).on("click", ".new-list-item", function () {
    $("#list-container").empty();
    listItemName = $(this).text().slice(0,-1);
    console.log(listItemName);
    $(".to-do-list-content").show();
    $(".main-content").hide();
    $(".content-heading").text(listItemName);

    todoTasks = membersDictionaries[memberId][listItemName];

    for (let i = 0; i < todoTasks.length; i++) {
      $("#list-container").append(
        '<li><input type="checkbox" class="task-checkbox" ' +
          todoTasks[i]["isChecked"] +
          '><span class="task-text">' +
          todoTasks[i]["name"] +
          "</span></li>"
      );
    }
  });
  $(".add-new").click(function () {
    $(".new-task").show();
  });

  $("#create-btn").click(function () {
    $(".new-task").hide();
    $(".to-do-list-content").show();
    $(".main-content").hide();

    var newListName = $("#task-name-input").val().trim();
    $("#task-name-input").val("");

    membersDictionaries[memberId][newListName] = [];

    localStorage.setItem(
      "membersDictionaries",
      JSON.stringify(membersDictionaries)
    );
    var newList = $('<div class="new-list-item">' + newListName + "</div>");

    var deleteIcon = $('<img class="delete-icon" src="images/delete.png" alt="Delete">');
    var taskCounter = $('<span class="task-counter">0</span>');

    newList.append(taskCounter);
    newList.append(deleteIcon);

    $(".list-tasks").append(newList);
    $(".content-heading").text(newListName);
  });

  $("#cancel-btn").click(function () {
    $("#task-name-input").val("");

    $(".new-task").hide();
  });

  $(document).on("click", ".task-checkbox", function () {
    var currentListName = $(".content-heading").text();
    taskItem = $(this).parent().text();
    console.log(taskItem)
    var isChecked = $(this).prop("checked");
    console.log(isChecked);
    for (var i = 0; i < membersDictionaries[memberId][currentListName].length; i++) {
      if (membersDictionaries[memberId][currentListName][i]["name"] == taskItem) {
        console.log("I am here")
        membersDictionaries[memberId][currentListName][i]["isChecked"] = isChecked;
        if (isChecked) {
          // Add strikethrough
          $(this).siblings('.task-text').addClass('strikethrough');
      } else {
          // Remove strikethrough
          $(this).siblings('.task-text').removeClass('strikethrough');
      }
        localStorage.setItem(
          "membersDictionaries",
          JSON.stringify(membersDictionaries)
        );
        break;
      }
    }
    populateSidebarListSection();
  });

  $("#input-box").keypress(function (e) {
    if (e.which == 13) {
      // 13 is the Enter key
      var currentListName = $(".content-heading").text();
      console.log(currentListName);
      var newTask = $(this).val().trim();
      console.log(newTask);

      membersDictionaries[memberId][currentListName].push({
        "name": newTask,
        "isChecked": false,
      });
      localStorage.setItem(
        "membersDictionaries",
        JSON.stringify(membersDictionaries)
      );
      updateToDoListContentPage(currentListName);
      populateSidebarListSection();
      $("#input-box").val("");
    }
  });

  $("#project-members-field").click(function () {
    $(".to-do-list-content").hide();
    $(".new-task").hide();
    $(".main-content").show();
    $(".new-list-item").hide();
  });

  $(".member-container").click(function () {
    updateSidebarProfile($(this));
  });

  function updateSidebarProfile(memberDiv) {
    var name = memberDiv.find(".member-name").text();
    var email = memberDiv.find(".member-email").text();
    var imgSrc = memberDiv.find(".member-image").attr("src");
    var localmemberId = memberDiv.find(".member-id").text();

    $(".sidebar-header .profile-img").attr("src", imgSrc);
    $(".sidebar-header .sidebar-member-name").text(name);
    $(".sidebar-header .sidebar-member-email").text(email);
    $(".sidebar-header .sidebar-member-email").text(email);

    localStorage.setItem("memberId", localmemberId);
    memberId = localmemberId;

    populateSidebarListSection(memberId);
  }
});
