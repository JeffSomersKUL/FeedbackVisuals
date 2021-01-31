import re
import matplotlib.pyplot as plt
import sys
def to_req_type(method, path):
    if method == "POST":
        return ("POST",) # todo more
    elif method in ["OPTIONS", "HEAD"]:
        return ("PREFLIGHT",)
    elif method == "GET":
        main_page_reg = r"^/(\d\d)/(..)$"
        result = re.match(main_page_reg, path)
        if result is not None:
            return ("main_page", result.group(1), result.group(2)) 
        personal_page_reg = r"^/(\d\d)(..)(.*)"
        result = re.match(personal_page_reg, path)
        if result is not None:
            return ("personal_page", result.group(1), result.group(2), result.group(0)[1:]) 
        steps_reg = r"^/steps/(\d\d)/(..)"
        result = re.match(steps_reg, path)
        if result is not None:
            return ("steps", result.group(1), result.group(2)) 
        invalid_steps_reg = r"^/steps/.*"
        result = re.match(invalid_steps_reg, path)
        if result is not None:
            return ("invalid_steps", path) 
        admin_reg = r"^/(programs|overview|fetch)"
        result = re.match(admin_reg, path)
        if result is not None:
            return ("admin", path)
        personal_data_reg = r"^/data/(\d\d)/(..)/(.*)"
        result = re.match(personal_data_reg, path)
        if result is not None:
            return ("personal_data", result.group(1), result.group(2), result.group(3)) 
        question_reg = r"^/images/question/(\d+)/(.*)$"
        result = re.match(question_reg, path)
        if result is not None:
            return ("image", result.group(1), result.group(2)) 
        static_regexes = [ r"^/$", r"^/robots\.txt$", r"/sitemap\.xml\.gz$", r"/favicon\.ico$", r"/\.well-known/.*$", r"/sitemap_index\.xml$", r"/sitemap\.xml\.gz$", r"/apple-touch.*$", r"/.*\.ttf$", r"/atom\.xml$", r"/rightUpperCorner.PNG", r"/stepsExample.PNG"]
        for reg in static_regexes:
            result = re.match(reg, path)
            if result is not None:
                return ("static", path)
        hack_try_regexes = [r"/wp-login.php$", ".*wp-admin.*", r"/.*/content-manager/.*$", r"/ijkingstoets-11-ir(-ignore)*/.*$", r"/ijkingstoets-10-ir/.*$", r"/steps/.*/feedback\.html$"]
        for reg in hack_try_regexes:
            result = re.match(reg, path)
            if result is not None:
                return ("hack", path)

    print(f"UNKNOWN TYPE {method} {path}", file=sys.stderr)

def get_test(req_type):
    if req_type[0] in ["POST", "PREFLIGHT"]:
        return None
    elif req_type[0] in ["main_page", "steps"]:
        return f"{req_type[1]}{req_type[2]}"
    elif req_type[0] in ["personal_page", "personal_data"]:
        return f"{req_type[1]}{req_type[2]}"
    elif req_type[0] in ["image"]:
        return req_type[2][:4]
    elif req_type[0] in ["hack", "static", "admin", "invalid_steps"]:
        return None

    print(f"UNKNOWN test for type {req_type}", file=sys.stderr)

def get_feedback_code(req_type):
    if req_type[0] in ["POST", "PREFLIGHT"]:
        return None
    elif req_type[0] in ["main_page", "steps"]:
        return None
    elif req_type[0] in ["personal_page", "personal_data"]:
        return req_type[3]
    elif req_type[0] in "image":
        return req_type[2]

    print(f"UNKNOWN feedback code for type {req_type}",  file=sys.stderr)

def validate_feedback_codes(test, codes):
    valid, invalid = set(),set()
    for uri in codes:
        code = uri.split("?")[0]
        if code[:4] == test and len(code) == 9: # todo more?
            valid.add(code)
        else:
            invalid.add(code)
    return list(valid), list(invalid)

def nb_mails_sent(test): #TODO 20bi
    amounts = {
        "19la": 15,
        "19bw": 135,
        "19ib": 44,
        "19in": 598,
        "19hw": 100,
        "19hi": 200,
        "19ew": 129,
        "19wb": 169,
        "19id": 11,
        "19fa": 131,
        "17ia": 243,
        "17ir": 968,
        "17dw": 399,
        "18ia": 40,
        "18ir": 146,
        "20ww": 291,
        "18dw": 78,
        "19xa": 223,
        "19xb": 357,
        "19xc": 150,
        "19xd": 216,
        "19xe": 45,
        "20xf": 151
    }

    return amounts[test]

def is_not_test_request(test, date):
    date_sents = {
        "19la": "2020-08-28T07:20:00Z",
        "19bw": "2020-08-28T07:15:00Z",
        "19ib": "2020-08-27T16:40:00Z", 
        "19in": "2020-08-27T16:35:00Z", 
        "19hw": "2020-08-27T15:25:00Z", 
        "19hi": "2020-08-27T15:20:00Z", 
        "19ew": "2020-08-27T15:15:00Z", 
        "19wb": "2020-08-27T15:10:00Z", 
        "19id": "2020-08-28T11:40:00Z", 
        "19fa": "2020-08-28T11:45:00Z", 
        "17ia": "2020-09-02T11:25:00Z", 
        "17ir": "2020-09-02T11:30:00Z", 
        "20ww": "2020-09-02T11:40:00Z", 
        "17dw": "2020-09-02T15:00:00Z", 
        "18ia": "2020-09-14T13:40:00Z",
        "18ir": "2020-09-14T07:30:00Z",
        "18dw": "2020-09-16T15:15:00Z",
        "19xa": "2020-09-30T14:54:00Z", 
        "19xb": "2020-09-30T22:23:00Z", 
        "19xc": "2020-09-01T15:15:00Z", # TODO
        "19xd": "2020-10-02T13:37:00Z", 
        "19xe": "2020-10-02T13:40:00Z",
        "20xf": "2020-09-01T15:15:00Z", # TODO
    }

    date_sent = date_sents.get(test, None)

    return date_sent is not None and date_sent <= date

with open('log', 'r') as logfile:
    lines = logfile.readlines()
    requests = []
    for line in lines: #[:20]:
        reg = r"(POST|GET|OPTIONS|HEAD) (\/.*) (\d{3}) (\d+.\d+ ms) \[(.*)\]"
        result = re.match(reg, line.strip());
        if result is not None:
            method, path, status, response_time, date = result.groups()
            
            request = (to_req_type(method, path), status, date)
            if request[0] is not None:
                requests.append(request)
        else:
            print("No match for:" + line);

    test_data = {}

    for request in filter(lambda r: is_not_test_request(get_test(r[0]), r[2]), requests):
        req_type, status, date = request
        test = get_test(req_type)
        if test not in test_data:
            test_data[test] = {}
            test_data[test]["nb_requests"] = 0
        if status not in test_data[test]: 
            test_data[test][status] = {}
            test_data[test][status]["nb_requests"] = 0
        test_data[test]["nb_requests"] += 1
        test_data[test][status]["nb_requests"] += 1
        feedback_code = get_feedback_code(req_type)
        if feedback_code is not None:
            if feedback_code not in test_data[test][status]:
                test_data[test][status][feedback_code] = {}
            
            if req_type[0] not in test_data[test][status][feedback_code]:
                test_data[test][status][feedback_code][req_type[0]] = []
            test_data[test][status][feedback_code][req_type[0]].append((req_type, date))


    for test in test_data:
        images = { }
        images_total = { }
        images_by_code = { }
        data = test_data[test]
        valid_200 = 0
        print(f"Info for {test}")
        print(f"NB requests: {data['nb_requests']}")
        for status in filter(lambda s: s != 'nb_requests', data):
            status_data = data[status]
            print(f"Info for {test} with status {status}")
            feedback_codes = set(status_data.keys()) - {'nb_requests'}
            valid, invalid = validate_feedback_codes(test, feedback_codes);
            print(f"NB different users: {len(feedback_codes)}")
            print(f"NB valid users: {len(valid)}")
            if status == "200":
                valid_200=valid
            print(f"NB invalid users: {len(invalid)}")
            print(f"Valid users: {sorted(valid)}")
            print(f"Invalid users: {invalid}")

            if status[0] == "2":            
                for feedback_code in filter(lambda s: s!='nb_requests' and s in valid, status_data):
                    for image_req in status_data[feedback_code].get("image", []):
                        image = image_req[0][1] 
                        images_total[image] = images_total.get(image, 0) + 1
                        images[image] = images.get(image, set()).union({feedback_code})
                        images_by_code[feedback_code] = images_by_code.get(feedback_code, set()).union({image})
        image_keys = sorted(images.keys(), key=lambda v: int(v))
        print("Image views")
        totalHistData = []
        histData = []
        for image in image_keys:
            print(f"{image}: {images_total[image]}: {len(images[image])}")

            totalHistData.extend([int(image)] * images_total[image])
            histData.extend([int(image)] * len(images[image]))
        if len(image_keys) > 0: 
            highest_img = max(map(lambda v: int(v), image_keys))
            plt.subplot(2, 1, 1)
            plt.title(f"Views Vragen {test} ({len(valid_200)}/{nb_mails_sent(test)} bekeken feedback)")
            plt.hist(histData, bins=list(map(lambda x: x-0.5, range(highest_img+2))))
            plt.ylabel("Unieke views")
            plt.xticks(range(1, highest_img+1))

            plt.subplot(2, 1, 2)
            plt.hist(totalHistData, bins=list(map(lambda x: x-0.5,
                range(max(map(lambda v: int(v), image_keys))+2))))
            plt.ylabel("Totale views")
            plt.xticks(range(1,highest_img+1))

            plt.xlabel('vraag')
            #plt.show()
            fig = plt.gcf()
            fig.set_size_inches(18.5, 10.5)
            plt.savefig(f"{test}_images.png", dpi=None, facecolor='w', edgecolor='w',
                orientation='landscape', papertype=None, format=None,
                transparent=False, bbox_inches=None, pad_inches=0.1,
                frameon=None, metadata=None)
            plt.close()
        print("Image views by feedback code") 
        for feedback_code in sorted(valid_200):
            images = map(str, sorted(map(int, list(images_by_code.get(feedback_code, set())))));
            images_string = "|".join(images)
            print(f"{feedback_code}, {images_string}")
