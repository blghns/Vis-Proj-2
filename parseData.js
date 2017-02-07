var path = document.location.pathname;
var directory = path.substring(path.indexOf('/'), path.lastIndexOf('/'));
var data = {
    tab97:{},
    tab99:{},
    tab917:{}
};

function parse97(responseText){
    var currentRace = "";
    data.tab97 = d3.csvParseRows(responseText, function(row, i){
        //28th row is empty
        if(i == 27){
            return;
        }
        else if (i > 27){
            i--;
        }

        if (i > 2 && i < 100) {
            if (((i - 3) % 12) == 0) {
                currentRace = row[0].trim();
            }
            else if (!(
                ((i - 3) % 12) < 3 ||
                ((i - 3) % 12) > 8)) {

                row.forEach(function(d, i){
                    d = d.trim();
                    if (i != 0) {
                        d = d.replace(/,/g, "");
                        if (d === "D" || d === "S" || d === "")
                            d = NaN;
                        else
                            d = +d;
                    }
                    row[i] = d;
                });

                return {
                    Race: currentRace,
                    Science_Occupations: row[0],
                    All_Female: row[1],
                    All_Male: row[2],
                    Bachelors_Female: row[3],
                    Bachelors_Male: row[4],
                    Masters_Female: row[5],
                    Masters_Male: row[6],
                    Doctorate_Female: row[7],
                    Doctorate_Male: row[8]
                };
            }
        }
    });
}

function parse99(responseText){
    var ageGroup = "";
    data.tab99 = d3.csvParseRows(responseText, function(row, i) {
        if (i > 2 && i < 68){
            if((i-3) % 13 == 0){
                ageGroup=row[0].trim();
            }
            else if(!(
                ((i - 3) % 13) < 3 ||
                ((i - 3) % 13) == 4 ||
                ((i - 3) % 13) > 10)) {

                row.forEach(function(d, i){
                    d = d.trim();
                    if (i != 0) {
                        d = d.replace(/,/g, "");
                        if (d === "D" || d === "S" || d === "")
                            d = NaN;
                        else
                            d = +d;
                    }
                    row[i] = d;
                });

                return {
                    Age_Group: ageGroup,
                    Race: row[0],
                    Total_Population: row[1],
                    Full_Time: row[2],
                    Part_Time: row[3],
                    Seeking: row[4],
                    Not_Seeking: row[5],
                    Retired: row[6]
                };
            }
        }
    });
}

function parse917(responseText){
    var occupation = "";
    data.tab917 = d3.csvParseRows(responseText, function(row, i){
        var gender;
        if(i > 65 && i < 187){
            gender = "Female";
            if(i == 126){
                return;
            }
            if(i > 126){
               gender = "Male";
               i--;
            }
            if((i-66)%5 == 0){
                occupation = row[0].trim();
            }
            else{
                row.forEach(function(d, i){
                    d = d.trim();
                    if (i != 0) {
                        d = d.replace(/,/g, "");
                        if (d === "D" || d === "S" || d === "")
                            d = NaN;
                        else
                            d = +d;
                    }
                    row[i] = d;
                });
                return {
                    Science_Occupations: occupation,
                    Gender: gender,
                    Age_Group: row[0],
                    "All Ethnicities": row[1],
                    "Hispanic or Latinob": row[2],
                    "American Indian or Alaska Native": row[3],
                    "Asian": row[4],
                    "Black or African American": row[5],
                    "Native Hawaiian or Other Pacific Islander": row[6],
                    "White": row[7],
                    "More than one race": row[8]
                }
            }
        }
    });
}

d3.queue()
    .defer(d3.request, directory + "/data/tab9-7.csv")
    .defer(d3.request, directory + "/data/tab9-9.csv")
    .defer(d3.request, directory + "/data/tab9-17.csv")
    .awaitAll(awaited);

function awaited(err, arr){
    if (err) throw err;
    parse97(arr[0].responseText);
    parse99(arr[1].responseText);
    parse917(arr[2].responseText);
    drawGraphs();
}
