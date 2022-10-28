$(document).ready(function () {
    $('#itable').DataTable({
        ajax:{
            url:"/api/item/all",
            dataSrc: ""
        },
        dom:'Bfrtip',
        buttons:[
            'pdf',
            'excel',
            {
                text:'Add item',
                className: 'btn btn-primary',
                action: function(e, dt, node, config){
                    $("#iform").trigger("reset");
                    $('#itemModal').modal('show');
                }
            }
        ],

        columns:[

            {data: 'item_id'},
            {data: 'description'},
            {data: 'cost_price'},
            {data: 'sell_price'},
            {data: 'title'},
            // {data: 'imagePath'},
            { data: null,
                render: function (data, type, row) {
                    console.log(data.imagePath) 
                    return `<img src="/storage/${data.
                        imagePath}" width="50"
                    height="60">`;
                }
            },
            {data: null,
                    render: function (data, type, row) {
                        return "<a href='#' class='editBtn' id='editbutton' data-id=" + data.item_id + "><i class='fa-regular fa-pen-to-square' aria-hidden='true' style='font-size:24px' ></i></a>  <a href='#' class='deletebtn' data-id=" + data.item_id + "><i class='fa-regular fa-solid fa-trash' style='font-size:24px; color:red'></a></i>";
                },
            },
        ]
        
        
    })//end datatables

    
    $("#itemSubmit").on("click", function (e) {
        e.preventDefault();
        // var data = $("#iform").serialize();
        var data = $('#iform')[0];
        console.log(data);
        let formData = new FormData(data);

        console.log(formData);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        $.ajax({
            type: "post",
            url: "/api/item",
            data: formData,
            contentType: false,
            processData: false,
            // headers: {
            //     "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            // },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType:"json", 

            success:function(data){
                   console.log(data);
                   $("#itemModal").modal("hide");

                   var $itable = $('#itable').DataTable();
                   $itable.row.add(data.item).draw(false); 
            },

            error:function (error){
                console.log(error);
            }
        })
    });
    });




    $("#itable tbody").on("click", "a.editBtn", function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('#editItemModal').modal('show');


        $.ajax({
            type: "GET",
            url: "api/item/" + id + "/edit",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            dataType: "json",
            success: function(data){
                   console.log(data);
                   $("#eeitem_id").val(data.item_id);
                   $("#eedescription").val(data.description);
                   $("#eecost_price").val(data.cost_price);
                   $("#eesell_price").val(data.sell_price);
                   $("#eetitle").val(data.title);
                   $("#eeimagePath").val(data.imagePath);
                },
                error: function(){
                    console.log('AJAX load did not work');
                    alert("error");
                }
            });
        });//end edit fetch
        
        $("#updatebtnItem").on('click', function(e) {
            e.preventDefault();
            var id = $('#eeitem_id').val();
            //var data = $("#updateItemform").serialize();
            console.log(data);

            var table =$('#itable').DataTable();
            var cRow = $("tr td:contains(" + id + ")").closest('tr');
            var data =$("#ayform").serialize();

            $.ajax({
                type: "PUT",
                url: "api/item/"+ id,
                data: data,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    // $('#editItemModal').each(function(){
                    //         $(this).modal('hide'); });

                    $('#editItemModal').modal("hide");
                    table.row(cRow).data(data).invalidate().draw(false);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });//end update

            $("#itable tbody").on("click", "a.deletebtn", function (e) {
                var table = $('#itable').DataTable();
                var id = $(this).data('id');
                var $row = $(this).closest('tr');
                console.log(id);
        
                e.preventDefault();
                bootbox.confirm({
                    message: "Do you want to delete this item",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                        },
                        cancel: {
                            label: "No",
                            className: "btn-danger",
                        },
                    },

            callback: function (result) {
                if (result)
                    $.ajax({
                        type: "DELETE",
                        url: "/api/item/" + id,
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            // bootbox.alert('success');
                            // $tr.find("td").fadeOut(2000, function () {
                            //     $tr.remove();
                            $row.fadeOut(4000, function(){
                                table.row($row).remove().draw(false)
                            });
                            bootbox.alert(data.success)
                           
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    });
            },
        });
    });