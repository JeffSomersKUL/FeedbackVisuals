# import openpyxl module
import openpyxl
import csv


def get_column_number(col_letter):
    return ord(col_letter) - 64


def represents_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


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
column_questions_letter = 'A'
column_questions_number = get_column_number(column_questions_letter)
column_thema_letter = 'B'
column_thema_number = get_column_number(column_thema_letter)
column_kind_of_question_letter = 'C'
column_kind_of_question_number = get_column_number(column_kind_of_question_letter)
column_maximal_score_letter = 'D'
column_maximale_score_number = get_column_number(column_maximal_score_letter)
#########################################################

#########################################################
# known data from survey ##############################
column_response_ID_letter = 'I'
column_response_ID_number = get_column_number(column_response_ID_letter)
row_question_number = 1
#########################################################


# return the row number as in excel
def get_row_student(response_id, sheet_servey, column_len_survey):
    row_index = 3
    while row_index <= column_len_survey:
        value_row_id = sheet_servey.cell(row=row_index, column = column_response_ID_number).value
        if value_row_id == response_id:
            return row_index
        row_index += 1
    return None


# return the column number as in excel
def get_column_question(question, sheet_servey, row_len_survey):
    column_index = 14
    while column_index <= row_len_survey:
        value_column_index = sheet_servey.cell(row=row_question_number, column=column_index).value
        if value_column_index == question:
            return column_index
        column_index += 1
    return None


def get_total_score(list_of_score):
    full_score = 0
    for score in list_of_score:
        full_score += score
    return full_score / len(list_of_score)


###################
multiple = 0
one_possible = 1
###################


def calculate_score_single(index_question, number_question_offsets, maximale_score, sheet_template):
    sum_score = 0
    for offset in number_question_offsets:
        if represents_int(offset):
            offset_score = sheet_template.cell(row=index_question, column=int(column_maximale_score_number) +
                                                                          int(offset)).value
            sum_score += offset_score
    var_score = float(sum_score) / float(maximale_score)
    if var_score > 1:
        return 1
    else:
        return var_score


def calculate_score_multiple(index_question, number_question_offset, maximale_score, sheet_template):
    weighted_score = sheet_template.cell(row=index_question, column=int(column_maximale_score_number) +
                                                                    int(number_question_offset)).value
    return float(weighted_score) / float(maximale_score)


def get_score(kind, index_question, number_question_offset, maximale_score, sheet_template):
    score = 0
    if kind == one_possible:
        score = calculate_score_multiple(index_question, number_question_offset, maximale_score, sheet_template)
    elif kind == multiple:
        score = calculate_score_single(index_question, number_question_offset, maximale_score, sheet_template)
    return score


# gets the data from the excel file from one student
def get_list_data(student, sheet_template, sheet_servey, column_len_template, column_len_survey, row_len_survey):
    data_plan_van_aanpak = []
    data_concepten = []
    data_wiskundig_model = []
    data_rekentechnische_aanpak = []
    data_fysische_interpretatie = []

    row_index_questions = 2
    row_student = get_row_student(student, sheet_servey, column_len_survey)  # kan nog sneller door mee de rij van de student al doortegeven ipv die hier terug opnieuw op te zoeken
    # for each question in the template we search the correct score for the student and add it to the correct thema
    while row_index_questions <= column_len_template:
        question = sheet_template.cell(row=row_index_questions, column=column_questions_number).value  # template
        thema = sheet_template.cell(row=row_index_questions, column=column_thema_number).value  # template
        kind = sheet_template.cell(row=row_index_questions, column=column_kind_of_question_number).value  # template
        maximale_score = sheet_template.cell(row=row_index_questions, column=column_maximale_score_number).value  # template

        question_column_number = get_column_question(question, sheet_servey, row_len_survey)  # survey
        answer_student = sheet_servey.cell(row=row_student, column=question_column_number).value  # survey

        score = get_score(kind, row_index_questions, answer_student, maximale_score, sheet_template)

        # add it to the right thema
        if int(thema) == plan_van_aanpak:
            data_plan_van_aanpak.append(score)
        elif int(thema) == concepten:
            data_concepten.append(score)
        elif int(thema) == wiskundig_model:
            data_wiskundig_model.append(score)
        elif int(thema) == rekentechnische_aanpak:
            data_rekentechnische_aanpak.append(score)
        elif int(thema) == fysische_interpretatie:
            data_fysische_interpretatie.append(score)
        row_index_questions += 1

    data = [get_total_score(data_plan_van_aanpak), get_total_score(data_concepten), get_total_score(data_wiskundig_model), get_total_score(data_rekentechnische_aanpak), get_total_score(data_fysische_interpretatie)]
    return data


def create_csv_file(servey, template):
    servey_file = servey
    template_file = template

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

    column_len_template = len(list(sheet_template.columns)[0])

    column_len_survey = len(list(sheet_servey.columns)[0])
    row_len_survey = len(list(sheet_servey.rows)[0])


    with open('test.csv', 'w', newline= '') as file:
        writer = csv.writer(file)
        row_index = 3
        while row_index < column_len_survey:
            student = sheet_servey.cell(row=row_index, column=column_response_ID_number).value
            data_student = get_list_data(student, sheet_template, sheet_servey, column_len_template, column_len_survey, row_len_survey)
            writer.writerow([student] + data_student)
            row_index += 1


create_csv_file('data_kul.xlsx','template.xlsx')