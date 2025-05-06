import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../store/calendarSlice";
import {
  saveEvent,
  loadEvents,
  removeEventFromDatabase,
} from "../utils/actions/calendarActions";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setEvents, removeEvent } from "../store/calendarSlice";
import EventItem from "../components/EventItem";
import PageContainer from "../components/PageContainer";
import colors from "../constans/colors";

const CalendarScreen = (props) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dispatch = useDispatch();
  const events = useSelector(
    (state) => state.calendar.storedEvents[selectedDay] || []
  );
  const storedEvents = useSelector((state) => state.calendar.storedEvents);
  const userData = useSelector((state) => state.auth.userData);

  const markedDates = useMemo(() => {
    const marks = {};

    Object.keys(storedEvents).forEach((date) => {
      if (storedEvents[date]?.length > 0) {
        marks[date] = {
          marked: true,
          dotColor: colors.primaryColor,
        };
      }
    });

    if (selectedDay) {
      marks[selectedDay] = {
        ...(marks[selectedDay] || {}),
        selected: true,
        selectedColor: colors.primaryColor,
        selectedTextColor: "white",
      };
    }

    return marks;
  }, [storedEvents, selectedDay]);

  const addNewEvent = (day) => {
    setSelectedDay(day.dateString);
  };

  const handleSaveEvent = async () => {
    const eventData = {
      date: selectedDay,
      title: eventTitle,
      time: eventTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    dispatch(addEvent(eventData));

    await saveEvent(userData.userId, eventData);

    setEventTitle("");
    setModalVisible(false);
    setEventTime(new Date());
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData?.userId) return;

      const loadedEvents = await loadEvents(userData.userId);

      dispatch(setEvents(loadedEvents));
    };

    fetchEvents();
  }, [userData]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <AntDesign
            style={styles.addEventIcon}
            name="pluscircleo"
            size={25}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <Calendar
          style={{
            backgroundColor: colors.backgroundColor,
            borderRadius: 10,
            marginTop: 10,
          }}
          onDayPress={addNewEvent}
          markedDates={markedDates}
          minDate={new Date().toISOString().split("T")[0]}
          theme={{
            backgroundColor: colors.backgroundColor,
            calendarBackground: colors.backgroundColor,

            textSectionTitleColor: colors.primaryColor,
            dayTextColor: colors.primaryColor,
            todayTextColor: colors.primaryColor,
            selectedDayTextColor: "white",

            arrowColor: colors.primaryColor,
            monthTextColor: colors.primaryColor,
            textMonthFontWeight: "bold",
            textDayFontWeight: "500",
            textDayHeaderFontWeight: "bold",

            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
          avoidKeyboard={true}
        >
          <View style={styles.modalContentContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>Dodaj wydarzenie</Text>
                <Text style={styles.modalDate}>{selectedDay}</Text>

                <TextInput
                  placeholder="Tytuł wydarzenia"
                  placeholderTextColor="#aba5a5"
                  style={styles.input}
                  value={eventTitle}
                  onChangeText={setEventTitle}
                  keyboardAppearance="dark"
                />

                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    Wybierz godzine:{" "}
                    {eventTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>

                <DateTimePicker
                  isVisible={showTimePicker}
                  mode="time"
                  date={eventTime}
                  onConfirm={(date) => {
                    setEventTime(date);
                    setShowTimePicker(false);
                  }}
                  onCancel={() => setShowTimePicker(false)}
                  is24Hour={true}
                  confirmTextIOS="Wybierz"
                  cancelTextIOS="Anuluj"
                  pickerContainerStyleIOS={styles.pickerStyle}
                  textColor="white"
                  buttonTextColorIOS={colors.primaryColor}
                  isDarkModeEnabled={true}
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEvent}
                >
                  <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <FlatList
          data={events}
          renderItem={(itemData) => {
            const eventData = itemData.item;
            const eventTime = eventData.time;
            const eventTitle = eventData.title;
            const eventId = eventData.id;

            return (
              <EventItem
                title={eventTitle}
                time={eventTime}
                onDelete={async () => {
                  dispatch(removeEvent({ date: selectedDay, id: eventId }));
                  await removeEventFromDatabase(userData.userId, eventId);
                }}
              />
            );
          }}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContentContainer: {
    backgroundColor: "#2e2a2a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalDate: {
    fontSize: 16,
    color: "#aba5a5",
    marginBottom: 15,
    alignSelf: 'center'
  },
  input: {
    backgroundColor: "#615858",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  saveButton: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeButton: {
    backgroundColor: "#615858",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  timeButtonText: {
    fontSize: 18,
    color: "#aba5a5",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dateTimePicker: {
    alignSelf: "center",
    marginBottom: 15,
  },
  addEventIcon: {
    marginRight: 10,
  },
  pickerStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2a2a",
    padding: 10,
  },
});

export default CalendarScreen;
