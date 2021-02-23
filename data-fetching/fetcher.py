# import openpyxl module
import openpyxl

# Give the location of the file
servey_file = 'data_kul.xlsx'
template_file = 'template.xlsx'

# To open the workbook
# workbook object is created
wb_servey = openpyxl.load_workbook(servey_file)
wb_template = openpyxl.load_workbook(template_file)


# Get workbook active sheet object
# from the active attribute
sheet_servey = wb_servey.active
sheet_template = wb_template.active

# Cell objects also have a row, column,
# and coordinate attributes that provide
# location information for the cell.

# Note: The first row or
# column integer is 1, not 0.

# Cell object is created by using
# sheet object's cell() method.

value_file = sheet_servey.values



def get_column_number(col_letter):
    return ord(col_letter) - 64

#########################################################
# Waarden van de thema's ################################
plan_van_aanpak = 0
concepten = 1
wiskundig_model = 2
rekentechnische_aanpak = 3
fysische_interpretatie = 4
#########################################################

#########################################################
# known data from template ##############################
column_len_template = len(list(sheet_template.columns)[0])
column_questions_letter = 'A'
column_questions_number = get_column_number(column_questions_letter)
column_thema_letter = 'B'
column_thema_number = get_column_number(column_thema_letter)
column_best_score_letter = 'C'
column_best_score_number = get_column_number(column_best_score_letter)
#########################################################

#########################################################
# known data from survey ##############################
column_len_survey = len(list(sheet_servey.columns)[0])
row_len_survey = len(list(sheet_servey.rows)[0])
column_response_ID_letter = 'I'
column_response_ID_number = get_column_number(column_response_ID_letter)
row_question_number = 1
#########################################################


# return the row number as in excel
def get_row_student(response_id):
    row_index = 3
    while(row_index <= column_len_survey):
        value_row_id = sheet_servey.cell(row=row_index, column = column_response_ID_number).value
        if (value_row_id == response_id):
            return row_index
        row_index += 1
    return None

# return the column number as in excel
def get_column_question(question):
    column_index = 14
    while(column_index <= row_len_survey):
        value_column_index = sheet_servey.cell(row=row_question_number, column=column_index).value
        if (value_column_index == question):
            return column_index
        column_index += 1
    return None


def get_total_score(list_of_score):
    full_score = 0
    for score in list_of_score:
        full_score += score
    return full_score / len(list_of_score)


def get_score_weight(index_question, number_question_offset):
    score = sheet_template.cell(row=index_question, column= int(column_best_score_number) + int(number_question_offset)).value
    return score

# gets the data from the excel file from one student
def get_string_data(student):
    data_plan_van_aanpak = []
    data_concepten = []
    data_wiskundig_model = []
    data_rekentechnische_aanpak = []
    data_fysische_interpretatie = []

    row_index_questions = 2
    row_student = get_row_student(student)
    # for each question in the template we search the correct score for the student and add it to the correct thema
    while(row_index_questions <= column_len_template):
        question = sheet_template.cell(row=row_index_questions, column=column_questions_number).value  # template
        thema = sheet_template.cell(row=row_index_questions, column=column_thema_number).value  # template
        best_score = sheet_template.cell(row=row_index_questions, column=column_best_score_number).value  # template

        question_column_number = get_column_question(question)  # survey
        answer_student = sheet_servey.cell(row=row_student, column=question_column_number).value  # survey

        weighted_score = get_score_weight(row_index_questions, answer_student)

        score = float(weighted_score)/float(best_score)

        # add it to the right thema
        if (int(thema) == plan_van_aanpak):
            data_plan_van_aanpak.append(score)
        elif (int(thema) == concepten):
            data_concepten.append(score)
        elif (int(thema) == wiskundig_model):
            data_wiskundig_model.append(score)
        elif (int(thema) == rekentechnische_aanpak):
            data_rekentechnische_aanpak.append(score)
        elif (int(thema) == fysische_interpretatie):
            data_fysische_interpretatie.append(score)
        row_index_questions += 1

    data = [get_total_score(data_plan_van_aanpak), get_total_score(data_concepten), get_total_score(data_wiskundig_model), get_total_score(data_rekentechnische_aanpak), get_total_score(data_fysische_interpretatie)]

    print(data)


get_string_data('R_rlhK0u1DVNtVZbH')

###nog fixen dat ik ook met meerdere waardes kan werken en wanneer je niks ingeeft
