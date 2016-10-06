$(document).ready(function(){
    $.fn.editable.defaults.send = "always";
    $("#user-name").focus();
    $('.xedit').editable({
        tpl: '<input type="text" name="name" class="name">'
    });

    $(document).on('click','.editable-submit',function(){
        console.log("editable-submit was clicked, nice!");
        var num = $(this).closest('td').children('span').attr('id');
        console.log("num: " + num);
        var nameValue = $(".name").val();
        console.log("nameValue: " + nameValue);

        var myObj = {};
        myObj.id = num;

        console.log("myObj.id: " + myObj.id);

        if ($("input").hasClass("name")){
            myObj.name = nameValue;
        }

        console.log("myObj.name: " + myObj.name);

        $.ajax({
            url: '/update/' + myObj.id + '/' + myObj.name,
            type: 'POST',
            success: function(s){
                console.log("s: " + s);
            },
            error: function(e){
                console.log("e: " + e);
            }
        }); 
    });

    $('#user-submit').click(function () {
        $(".delete-item").show();
        var payload = {
            name: $('#user-name').val(),
            email: $('#user-email').val(),
            age: $('#user-age').val()
        };
        console.log("payload name: " + payload.name);
        console.log("payload email: " + payload.email);
        console.log("payload age: " + payload.age);

        var id = $(this).parents('tr').find('input:hidden').val();

        $.ajax({
            url: "/users",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            success: function(result){ 
                $("#user-name, #user-email, #user-age").val("");
                var deleteIcon = "<input type='button' value='Delete Row' id='"+result.id+"' class='delete-item btn btn-danger'/>";
                var newRow = "<tr>";
                newRow += "<td><span class='xedit' id='"+result.id+"'>"+payload.name+"</span></td>";
                newRow += "<td>"+payload.email+"</td>";
                newRow += "<td>"+payload.age+"</td>"
                newRow += "<td>"+deleteIcon+"</td></tr>";
                $('.table ' + ' tbody').append(newRow);
                $("#"+result.id).click(function(){
                    console.log("MADE IT IN");
                    var tr = $(this).closest('tr');
                    var id = $(this).parents('tr').find('input:hidden').val();
                    console.log("row_id: " + result.id);
                    $.ajax({
                        datatype: "json", 
                        type: "POST",
                        url: "/" + result.id,
                        success: function(data, statusText, jqXHR){
                            console.log("DATA: " + data);
                            console.log("Status Text: " + statusText);
                            tr.remove();
                        },
                        error: function(response){
                            console.log("Response >>> " + response);
                        }
                    });
                });
            }

        });
    });

    $(".delete-item").click(function(){
        console.log("inside .delete-item click function");
        var tr = $(this).closest('tr');
        var id = $(this).parents('tr').find('input:hidden').val();
        console.log("row_id: " + id);
        $.ajax({
            datatype: "json", 
            type: "POST",
            url: "/" + id,
            success: function(data, statusText, jqXHR){
                console.log("DATA: " + data);
                console.log("Status Text: " + statusText);
                tr.remove();
            },
            error: function(response){
                console.log("Response >>> " + response);
            }
        });
    });
});



    