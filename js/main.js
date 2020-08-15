$(document).ready(function() {
    make_droppable();
    make_draggable();
});

function make_droppable() {
    for (let i = 0; i < 15; i++) {
        var id = "#drop" + i;
        $(id).droppable({
            accept: "#tile-holder li, #board li",
            classes: {
                "ui-droppable-active": "highlight"
            },
            /* make droppable accept only one draggable
             * https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
             */
            drop: function(event, ui) {
                $(this).append(ui.draggable);
                $(this).droppable("option", "accept", ui.draggable);
            },
            out: function(event, ui) {
                $(this).droppable("option", "accept", "#tile-holder > li, #board li");
            }
        });
    }
    $("#tile-holder").droppable({
        accept: "#board li",
        classes: {
            "ui-droppable-active": "highlight"
        },
        drop: function(event, ui) {
            $(this).append(ui.draggable);
        }
    });
}

function make_draggable() {
    // Load up 7 tiles
    for (let i = 0; i < 7; i++) {
        var letter = get_random_tile();
        var image_path = "resources/tile_imgs/Scrabble_Tile_";

        // HTML
        tile = "<li><img class='tile' src='" + image_path + letter + ".jpg' alt='" + letter + "'></img></li>";
        // load up tiles
        $("#tile-holder").append(tile);
    }
    // make the tiles draggable
    $("#tile-holder li").draggable({
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        cursor: "move",
        stop: function(event, ui) {
            $(this).removeAttr("style");
            update_word();
            calc_score();
        }
    });
}

var current_word = "",
    current_score = 0;

function update_word() {
    current_word = "";
    let c;
    $("#board ul").each(function() {
        c = $(this).children().length > 0 ?
            $("img", this).attr('alt') :
            "_";
        current_word += c;
    });
    current_word = current_word.replace(/^_+|_+$/gm, '');
    $("#word").text("Word: " + current_word);
}

function calc_score() {
    var score = 0;
    for (let i = 0; i < current_word.length; i++) {
        let c = current_word.charAt(i);
        score += get_char_info(c).value;
    }
    if ($("#drop2").children().length > 0) {
        score += score;
    }
    if ($("#drop12").children().length > 0) {
        score += score;
    }
    if ($("#drop6").children().length > 0) {
        score += get_char_info($("img", $("#drop6").children()).attr('alt')).value;
    }
    if ($("#drop8").children().length > 0) {
        score += get_char_info($("img", $("#drop8").children()).attr('alt')).value;
    }
    $("#score").text("Score: " + score);
}