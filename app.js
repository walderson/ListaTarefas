"use strict";

class ListaTarefas {
    constructor() {
        var version = "1.2",
            appStorage = new AppStorage("listaTarefas");

        function setStatus(message) {
            $("#app>footer").text(message);
        }

        this.start = function() {
            $("#new-task-name").keypress(function (e) {
                if (e.which == 13) {
                    addTask();
                    return false;
                }
            }).focus();

            loadTheme();
            $("#theme").change(function () { onChangeTheme(); });
            $("#app>header").append(version);
            loadTaskList();
            setStatus("Pronto");
        };

        function onChangeTheme() {
            var theme = $("#theme>option").filter(":selected").val();
            setTheme(theme);
            appStorage.setValue("theme", theme);
        }

        function setTheme(theme) {
            $("#theme-style").attr("href", "themes/" + theme + ".css");
        }

        function loadTheme() {
            var theme = appStorage.getValue("theme");
            if (theme) {
                setTheme(theme);
                $("#theme>option[value=" + theme + "]").attr("selected", "selected");
            }
        }

        function addTask() {
            var taskName = $("#new-task-name").val();
            if (taskName) {
                addTaskElement(taskName);
                $("#new-task-name").val("").focus();
                saveTaskList();
            }
        }

        function addTaskElement(taskName) {
            var $task = $("#task-template .task").clone();
            $task.click(function() {onSelectTask($task)});
            $("span.task-name", $task).text(taskName);
            $("button.delete", $task).click(function () { removeTask($task); });
            $("button.move-up", $task).click(function () { moveTask($task, true); });
            $("button.move-down", $task).click(function () { moveTask($task, false); });
            $("span.task-name", $task).click(function () { onEditTaskName($(this)); });
            $("input.task-name", $task).change(function () { onChangeTaskName($(this)); })
                .blur(function () { $(this).hide().siblings("span.task-name").show(); });
            $("#task-list").append($task);
        }

        function onSelectTask($task) {
            if ($task) {
                $task.siblings(".selected").removeClass("selected");
                $task.addClass("selected")
            }
        }

        function removeTask($task) {
            $task.remove();
            saveTaskList();
        }

        function moveTask($task, moveUp) {
            if (moveUp) $task.insertBefore($task.prev());
            else $task.insertAfter($task.next());
            saveTaskList();
        }

        function onEditTaskName($span) {
            $span.hide()
                .siblings("input.task-name")
                .val($span.text())
                .show()
                .focus();
        }

        function onChangeTaskName($input) {
            $input.hide();
            var $span = $input.siblings("span.task-name");
            if ($input.val()) {
                $span.text($input.val());
                saveTaskList();
            }
            $span.show();
        }

        function saveTaskList() {
            var tasks = [];
            $("#task-list .task span.task-name").each(function () {
                tasks.push($(this).text());
            });
            appStorage.setValue("taskList", tasks);
        }

        function loadTaskList() {
            var tasks = appStorage.getValue("taskList");
            if (tasks) {
                for (var i in tasks) {
                    addTaskElement(tasks[i]);
                }
            }
        }
    }
}

$(function() {
    window.app = new ListaTarefas();
    window.app.start();
});